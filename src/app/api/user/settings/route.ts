import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/user/settings — Fetch current user settings
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId query parameter required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                telegramChatId: true,
                reminderLevel: true,
                quietStart: true,
                quietEnd: true,
                darkMode: true,
                plan: true,
                timezone: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to fetch settings';
        console.error('[User Settings GET]', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}

// PATCH /api/user/settings — Update user preferences
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { userId, ...updates } = body;

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Whitelist allowed fields to update
        const allowedFields = ['name', 'phone', 'telegramChatId', 'reminderLevel', 'quietStart', 'quietEnd', 'darkMode', 'timezone'];
        const sanitized: Record<string, unknown> = {};

        for (const key of allowedFields) {
            if (key in updates) {
                // Convert reminderLevel string to enum format
                if (key === 'reminderLevel') {
                    sanitized[key] = String(updates[key]).toUpperCase();
                } else {
                    sanitized[key] = updates[key];
                }
            }
        }

        if (Object.keys(sanitized).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: sanitized,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                telegramChatId: true,
                reminderLevel: true,
                quietStart: true,
                quietEnd: true,
                darkMode: true,
                timezone: true,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to update settings';
        console.error('[User Settings PATCH]', errorMsg);
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
