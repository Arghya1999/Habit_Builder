import { NextResponse } from 'next/server';
import { setWebhook, deleteWebhook, getBotInfo } from '@/lib/telegram';

// POST /api/telegram/setup — Register webhook with Telegram
// Call this once after deployment:
// curl -X POST https://your-domain.vercel.app/api/telegram/setup
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({})) as { action?: string };
        const action = body.action || 'set';

        if (action === 'delete') {
            const result = await deleteWebhook();
            return NextResponse.json({
                success: result.ok,
                action: 'deleted',
                message: 'Webhook removed. Bot will no longer receive messages.',
                ...result,
            });
        }

        // Auto-detect the base URL from the request
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const webhookUrl = `${baseUrl}/api/telegram/webhook`;

        // Verify bot first
        const botInfo = await getBotInfo();
        if (!botInfo.ok) {
            return NextResponse.json({
                success: false,
                error: 'Bot token is invalid. Check TELEGRAM_BOT_TOKEN in .env',
            }, { status: 400 });
        }

        // Set webhook
        const result = await setWebhook(webhookUrl);

        return NextResponse.json({
            success: result.ok,
            action: 'set',
            webhookUrl,
            bot: botInfo.result,
            message: result.ok
                ? `✅ Webhook registered! Send /start to @${(botInfo.result as Record<string, unknown>)?.username} on Telegram.`
                : `❌ Failed: ${result.description}`,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to setup webhook';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}

// GET /api/telegram/setup — Check current webhook and bot status
export async function GET() {
    try {
        const botInfo = await getBotInfo();
        const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
        const webhookInfo = await res.json() as { ok: boolean; result?: Record<string, unknown> };

        return NextResponse.json({
            success: true,
            bot: botInfo.result,
            webhook: webhookInfo.result,
        });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to get status';
        return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
    }
}
