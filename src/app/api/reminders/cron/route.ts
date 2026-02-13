import { NextResponse } from 'next/server';
import { sendTelegramReminder } from '@/lib/telegram';
import { generateMotivation } from '@/lib/ai';
import prisma from '@/lib/prisma';

// GET /api/reminders/cron — Cron handler (Called by GitHub Actions every 30 mins)
// Configured in .github/workflows/cron.yml
export async function GET(request: Request) {
    // Verify cron secret in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const serverTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
        // Query all users who have Telegram configured and active reminder schedules
        const users = await prisma.user.findMany({
            where: {
                telegramChatId: { not: null },
                reminderLevel: { in: ['TELEGRAM', 'ESCALATING'] },
            },
            select: {
                id: true,
                name: true,
                telegramChatId: true,
                timezone: true,
                quietStart: true,
                quietEnd: true,
                currentStreak: true,
                habits: {
                    select: { name: true, currentStreak: true },
                },
            },
        });

        if (users.length === 0) {
            return NextResponse.json({
                success: true,
                time: serverTime,
                message: 'No users with Telegram reminders configured.',
                sent: 0,
            });
        }

        const checkInTimes = ['06:00', '08:00', '12:00', '18:00', '20:00', '21:00'];
        let sent = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const user of users) {
            // Get user's local time
            let userTime: string;
            try {
                userTime = now.toLocaleTimeString('en-GB', {
                    timeZone: user.timezone || 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            } catch (e) {
                // Fallback to UTC if timezone is invalid
                userTime = now.toLocaleTimeString('en-GB', {
                    timeZone: 'UTC',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
            }

            // Check if it's a check-in time for this user (within 7 minutes)
            const isCheckInTime = checkInTimes.some(t => {
                const [tH, tM] = t.split(':').map(Number);
                const [uH, uM] = userTime.split(':').map(Number);
                const diff = Math.abs((tH * 60 + tM) - (uH * 60 + uM));
                return diff <= 7; // 15-minute window (+/- 7 mins) still works for 30-min cron
            });

            if (!isCheckInTime) {
                skipped++;
                continue;
            }

            // Skip users in quiet hours
            if (user.quietStart && user.quietEnd) {
                if (isInQuietHours(userTime, user.quietStart, user.quietEnd)) {
                    skipped++;
                    continue;
                }
            }

            if (!user.telegramChatId) continue;

            try {
                // Generate AI-personalized motivation
                const message = await generateMotivation({
                    name: user.name || undefined,
                    currentStreak: user.currentStreak,
                    habits: user.habits.map((h: { name: string; currentStreak: number }) => ({
                        name: h.name,
                        streak: h.currentStreak,
                    })),
                });

                await sendTelegramReminder(user.telegramChatId, message, 'routine');
                sent++;
            } catch (err) {
                const msg = err instanceof Error ? err.message : 'Unknown';
                errors.push(`User ${user.id}: ${msg}`);
            }
        }

        return NextResponse.json({
            success: true,
            serverTime,
            totalUsers: users.length,
            sent,
            skipped,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to run cron';
        console.error('[Cron]', errorMsg);
        return NextResponse.json(
            { success: false, serverTime, error: errorMsg },
            { status: 500 },
        );
    }
}

function isInQuietHours(current: string, start: string, end: string): boolean {
    if (start <= end) {
        return current >= start && current <= end;
    }
    return current >= start || current <= end;
}
