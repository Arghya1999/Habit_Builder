import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';

// POST /api/reminders/telegram — Send a Telegram message
export async function POST(request: Request) {
    try {
        const { chatId, message } = await request.json();

        if (!chatId || !message) {
            return NextResponse.json(
                { error: 'Both "chatId" and "message" are required' },
                { status: 400 },
            );
        }

        const result = await sendTelegramMessage(chatId, message);

        return NextResponse.json({ success: true, ...result });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to send Telegram message';
        console.error('[Telegram]', errorMsg);
        return NextResponse.json(
            { success: false, error: errorMsg },
            { status: 500 },
        );
    }
}
