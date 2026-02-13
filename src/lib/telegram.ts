// ── Telegram Bot API Service ─────────────────────────────────────────
// No npm packages needed — uses native fetch() to call Telegram API.
// 100% free, unlimited messages.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramResponse {
    ok: boolean;
    description?: string;
    result?: Record<string, unknown>;
}

// ── Send Message ─────────────────────────────────────────────────────
export async function sendTelegramMessage(
    chatId: string | number,
    text: string,
    parseMode: 'HTML' | 'Markdown' = 'HTML',
    replyToMessageId?: number,
): Promise<TelegramResponse> {
    // Telegram limits messages to 4096 chars
    const truncated = text.length > 4000 ? text.slice(0, 4000) + '\n\n... (truncated)' : text;

    const body: Record<string, unknown> = {
        chat_id: chatId,
        text: truncated,
        parse_mode: parseMode,
    };

    if (replyToMessageId) {
        body.reply_to_message_id = replyToMessageId;
    }

    const res = await fetch(`${BASE_URL}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const data = await res.json() as TelegramResponse;

    if (!data.ok) {
        throw new Error(data.description || 'Telegram API error');
    }

    return data;
}

// ── Send "typing" indicator ──────────────────────────────────────────
export async function sendTypingAction(chatId: string | number): Promise<void> {
    await fetch(`${BASE_URL}/sendChatAction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
    });
}

// ── Send Reminder (formatted) ────────────────────────────────────────
export async function sendTelegramReminder(
    chatId: string | number,
    message: string,
    type: 'task' | 'habit' | 'routine' | 'streak' | 'general' = 'general',
): Promise<TelegramResponse> {
    const icons: Record<string, string> = {
        task: '📋',
        habit: '🔥',
        routine: '⏰',
        streak: '⚡',
        general: '🔔',
    };

    const formattedMessage = [
        `${icons[type]} <b>RoutineForge Reminder</b>`,
        '',
        message,
        '',
        '💪 <i>Stay consistent, you got this!</i>',
    ].join('\n');

    return sendTelegramMessage(chatId, formattedMessage, 'HTML');
}

// ── Escalating Reminder ──────────────────────────────────────────────
export interface ReminderResult {
    channel: 'push' | 'telegram';
    success: boolean;
    details?: Record<string, unknown>;
    error?: string;
}

export async function sendReminder(
    chatId: string,
    message: string,
    channel: 'push' | 'telegram' | 'escalating',
): Promise<ReminderResult[]> {
    const results: ReminderResult[] = [];

    if (channel === 'push' || channel === 'escalating') {
        results.push({
            channel: 'push',
            success: true,
            details: { note: 'Push notification queued (Web Push not yet configured)' },
        });

        if (channel === 'push') return results;
    }

    if (channel === 'telegram' || channel === 'escalating') {
        try {
            const tg = await sendTelegramReminder(chatId, message);
            results.push({
                channel: 'telegram',
                success: true,
                details: tg.result as Record<string, unknown>,
            });
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            results.push({ channel: 'telegram', success: false, error: errorMsg });
        }
    }

    return results;
}

// ── Webhook Management ──────────────────────────────────────────────
export async function setWebhook(url: string): Promise<TelegramResponse> {
    const res = await fetch(`${BASE_URL}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            url,
            allowed_updates: ['message'],
            drop_pending_updates: true,
        }),
    });
    return res.json() as Promise<TelegramResponse>;
}

export async function deleteWebhook(): Promise<TelegramResponse> {
    const res = await fetch(`${BASE_URL}/deleteWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ drop_pending_updates: true }),
    });
    return res.json() as Promise<TelegramResponse>;
}

// ── Get Bot Info (for verification) ──────────────────────────────────
export async function getBotInfo(): Promise<TelegramResponse> {
    const res = await fetch(`${BASE_URL}/getMe`);
    return res.json() as Promise<TelegramResponse>;
}

// ── Get Updates (to find chat IDs — only works without webhook) ──────
export async function getRecentUpdates(): Promise<TelegramResponse> {
    const res = await fetch(`${BASE_URL}/getUpdates?limit=10`);
    return res.json() as Promise<TelegramResponse>;
}
