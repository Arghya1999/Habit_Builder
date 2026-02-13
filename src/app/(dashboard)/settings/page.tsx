import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import SettingsClient from "./settings-client";
import { redirect } from "next/navigation";
import { getBotInfo } from "@/lib/telegram";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            id: true,
            name: true,
            email: true,
            telegramChatId: true,
            reminderLevel: true,
            quietStart: true,
            quietEnd: true,
            darkMode: true,
        }
    });

    if (!user) {
        redirect("/login");
    }

    // Attempt to get bot info safely
    let botUsername = 'RoutineForgeBot'; // Fallback
    try {
        // We might not get bot info if token is missing/invalid, 
        // so we swallow error and use fallback or env var if available
        // Actually, fetching it live triggers API call. 
        // For speed, let's try env var first if we had one "TELEGRAM_BOT_USERNAME", else fetch.
        const info = await getBotInfo();
        if (info.ok && info.result) {
            botUsername = (info.result as any).username;
        }
    } catch (e) {
        // console.error("Failed to fetch bot info", e);
    }

    return (
        <SettingsClient
            initialUser={{
                id: user.id,
                name: user.name || '',
                email: user.email,
                telegramChatId: user.telegramChatId,
                reminderLevel: user.reminderLevel,
                quietStart: user.quietStart,
                quietEnd: user.quietEnd,
                darkMode: user.darkMode
            }}
            botUsername={botUsername}
        />
    );
}
