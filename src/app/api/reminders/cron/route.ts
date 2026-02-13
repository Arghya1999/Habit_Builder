import { NextResponse } from 'next/server';
import { sendTelegramReminder } from '@/lib/telegram';
import { generateMotivation } from '@/lib/ai';
import prisma from '@/lib/prisma';

// GET /api/reminders/cron — Vercel Cron handler
// Configured in vercel.json: { "crons": [{ "path": "/api/reminders/cron", "schedule": "*/15 * * * *" }] }
export async function GET(request: Request) {
    // Verify cron secret in production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

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
                time: currentTime,
                message: 'No users with Telegram reminders configured.',
                sent: 0,
            });
        }

        // Check if current time is a reasonable reminder time
        const checkInTimes = ['06:00', '08:00', '12:00', '18:00', '20:00', '21:00'];
        const isCheckInTime = checkInTimes.some(t => {
            const [tH, tM] = t.split(':').map(Number);
            const [nH, nM] = currentTime.split(':').map(Number);
            const diff = Math.abs((tH * 60 + tM) - (nH * 60 + nM));
            return diff <= 7;
        });

        if (!isCheckInTime) {
            return NextResponse.json({
                success: true,
                time: currentTime,
                message: 'Not a check-in time. No reminders sent.',
                nextCheckIns: checkInTimes,
            });
        }

        let sent = 0;
        let skipped = 0;
        const errors: string[] = [];

        for (const user of users) {
            // Skip users in quiet hours
            if (user.quietStart && user.quietEnd) {
                if (isInQuietHours(currentTime, user.quietStart, user.quietEnd)) {
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
            time: currentTime,
            totalUsers: users.length,
            sent,
            skipped,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to run cron';
        console.error('[Cron]', errorMsg);
        return NextResponse.json(
            { success: false, time: currentTime, error: errorMsg },
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
