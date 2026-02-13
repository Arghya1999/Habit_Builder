import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "./dashboard-layout";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
            name: true,
            email: true,
            image: true,
            level: true,
            xp: true,
            currentStreak: true,
        }
    });

    if (!user) {
        redirect("/login");
    }

    // Calculate XP progress (example: 1000 XP per level)
    const xpForCurrentLevel = (user.level - 1) * 1000;
    const xpInThisLevel = user.xp - xpForCurrentLevel;
    const xpProgress = Math.min(100, Math.max(0, (xpInThisLevel / 1000) * 100));

    const userData = {
        name: user.name || "User",
        email: user.email,
        image: user.image || undefined,
        level: user.level,
        xp: user.xp,
        streak: user.currentStreak,
        xpProgress,
    };

    return <DashboardLayout userData={userData}>{children}</DashboardLayout>;
}
