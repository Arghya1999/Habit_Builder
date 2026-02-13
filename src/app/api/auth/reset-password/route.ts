import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Find token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: { token },
        });

        if (!verificationToken) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        if (new Date() > verificationToken.expires) {
            await prisma.verificationToken.delete({ where: { identifier_token: { identifier: verificationToken.identifier, token } } });
            return NextResponse.json({ error: 'Token expired' }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10);

        // Update user
        await prisma.user.update({
            where: { email: verificationToken.identifier },
            data: { passwordHash },
        });

        // Delete used token
        await prisma.verificationToken.delete({
            where: { identifier_token: { identifier: verificationToken.identifier, token } },
        });

        return NextResponse.json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
