import { NextResponse } from 'next/server';
import { sendReminder } from '@/lib/telegram';
import prisma from '@/lib/prisma';

type Channel = 'push' | 'telegram' | 'escalating';

// POST /api/reminders/send — Unified reminder dispatcher
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, chatId, message, channel } = body as {
            userId?: string;
            chatId?: string;
            message: string;
            channel?: Channel;
        };

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return NextResponse.json(
                { error: '"message" is required and must be a non-empty string' },
                { status: 400 },
            );
        }

        // Sanitize message — strip potential injection
        const sanitizedMessage = message.trim().slice(0, 2000);

        let targetChatId = chatId;
        let targetChannel: Channel = channel || 'push';

        // Validate channel value
        if (channel && !['push', 'telegram', 'escalating'].includes(channel)) {
            return NextResponse.json(
                { error: 'Invalid channel. Must be: push, telegram, or escalating' },
                { status: 400 },
            );
        }

        // If userId is provided, look up user preferences from DB
        if (userId && typeof userId === 'string') {
            try {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                        telegramChatId: true,
                        reminderLevel: true,
                        quietStart: true,
                        quietEnd: true,
                    },
                });

                if (user) {
                    // Use telegramChatId (not phone field)
                    if (!targetChatId && user.telegramChatId) {
                        targetChatId = user.telegramChatId;
                    }
                    if (!channel && user.reminderLevel) {
                        const level = user.reminderLevel.toLowerCase();
                        if (level === 'telegram') {
                            targetChannel = 'telegram';
                        } else if (level === 'escalating') {
                            targetChannel = 'escalating';
                        } else {
                            targetChannel = 'push';
                        }
                    }

                    // Check quiet hours
                    if (user.quietStart && user.quietEnd) {
                        const now = new Date();
                        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

                        if (isInQuietHours(currentTime, user.quietStart, user.quietEnd)) {
                            return NextResponse.json({
                                success: false,
                                reason: 'quiet_hours',
                                message: `Reminder skipped — quiet hours (${user.quietStart} - ${user.quietEnd})`,
                            });
                        }
                    }
                }
            } catch {
                console.warn('[Reminder] DB lookup failed for userId:', userId);
            }
        }

        // Validate chatId for Telegram channels
        if (targetChannel !== 'push' && !targetChatId) {
            return NextResponse.json(
                { error: 'Telegram Chat ID required. Provide "chatId" or set it in your profile.' },
                { status: 400 },
            );
        }

        const results = await sendReminder(targetChatId || '', sanitizedMessage, targetChannel);

        return NextResponse.json({
            success: true,
            channel: targetChannel,
            results,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send reminder';
        console.error('[Reminder Dispatch]', errorMsg);
        return NextResponse.json(
            { success: false, error: errorMsg },
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
