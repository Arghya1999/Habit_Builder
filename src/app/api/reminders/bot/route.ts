import { NextResponse } from 'next/server';
import { getBotInfo, getRecentUpdates } from '@/lib/telegram';

// GET /api/reminders/bot — Get bot info & recent chat IDs
export async function GET() {
    try {
        const [botInfo, updates] = await Promise.all([
            getBotInfo(),
            getRecentUpdates(),
        ]);

        // Extract unique chat IDs from recent messages
        const chatIds: { chatId: number; username: string; firstName: string }[] = [];
        const seen = new Set<number>();

        if (updates.ok && Array.isArray(updates.result)) {
            for (const update of updates.result) {
                const msg = (update as Record<string, unknown>).message as Record<string, unknown> | undefined;
                if (msg && msg.chat) {
                    const chat = msg.chat as Record<string, unknown>;
                    const chatId = chat.id as number;
                    if (!seen.has(chatId)) {
                        seen.add(chatId);
                        chatIds.push({
                            chatId,
                            username: (chat.username as string) || '',
                            firstName: (chat.first_name as string) || '',
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            bot: botInfo.result,
            recentChats: chatIds,
            instructions: chatIds.length === 0
                ? 'No chats found. Send /start to your bot on Telegram first, then refresh.'
                : `Found ${chatIds.length} chat(s). Copy your Chat ID to the settings page.`,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get bot info';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}
