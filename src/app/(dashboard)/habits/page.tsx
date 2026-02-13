import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import HabitsClient from "./habits-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function HabitsPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            habits: {
                include: {
                    logs: {
                        where: {
                            date: {
                                gte: new Date(new Date().setDate(new Date().getDate() - 7)) // Last 7 days
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) redirect("/login");

    const todayStr = new Date().toISOString().split('T')[0];

    const habits = user.habits.map((h: any) => {
        // Calculate week logs
        const weekLog = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toISOString().split('T')[0];
            const isDone = h.logs.some((l: any) => l.date.toISOString().split('T')[0] === dStr && l.completed);
            weekLog.push(isDone);
        }

        const todayDone = weekLog[6]; // Last element is today

        return {
            id: h.id,
            name: h.name,
            icon: h.icon,
            color: h.color,
            currentStreak: h.currentStreak,
            bestStreak: h.bestStreak,
            totalCompletions: h.totalDone,
            todayDone,
            weekLog
        };
    });

    return <HabitsClient initialHabits={habits} level={user.level} xp={user.xp} />;
}
