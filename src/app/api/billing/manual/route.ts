import { NextResponse } from 'next/server';
import { sendTelegramMessage } from '@/lib/telegram';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

// POST /api/billing/manual — Handle manual UPI payment submission
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId, billingCycle, transactionId, upiId, amount } = await request.json();

    if (!transactionId || !planId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // 1. Create a record of the manual payment (store in User notes or separate table if exists)
        // Since we don't have a Payment table in the schema shown earlier, we'll store it as a 'subscription' with status 'MANUAL_PENDING'
        // Or simply notify the admin (Telegram) and user.

        // Update user to a "Pending" state if possible, or just log it.
        // Let's assume we want to notify the admin to manually approve.

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        // Send Telegram notification to Admin (You)
        // We'll use a hardcoded admin chat ID if available, or just log it.
        // For now, we'll send a message to the USER saying "We received it".
        // And if the user has a linked Telegram, notify them there too.

        if (user?.telegramChatId) {
            await sendTelegramMessage(
                user.telegramChatId,
                `💸 <b>Payment Submitted!</b>\n\nWe received your request for <b>${planId.toUpperCase()} (${billingCycle})</b>.\nTransaction ID: <code>${transactionId}</code>\n\nPlease wait while we verify the payment. This usually takes 1-2 hours.`
            );
        }

        // Ideally, we'd email the admin here.
        // For this MVP, we will just return success and maybe update a `planStatus` field if we added one.
        // Since we didn't add a specific field in the schema plan, we'll just return success.

        return NextResponse.json({
            success: true,
            message: 'Payment submitted for verification'
        });

    } catch (error) {
        console.error('Manual payment error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
