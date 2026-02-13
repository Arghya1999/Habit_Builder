import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./dashboard-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            tasks: {
                where: {
                    // Fetch tasks that are not completed OR completed today
                    // Simple version: fetch all uncompleted tasks for now
                    completed: false
                },
                orderBy: { priority: 'asc' },
                take: 10
            },
            habits: {
                include: {
                    logs: {
                        where: {
                            date: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }
            }
        }
    });

    if (!user) {
        redirect("/login");
    }

    const tasks = user.tasks.map((t: any) => ({
        id: t.id,
        title: t.title,
        priority: t.priority,
        completed: t.completed,
    }));

    const habits = user.habits.map((h: any) => ({
        id: h.id,
        name: h.name,
        icon: h.icon,
        streak: h.currentStreak,
        done: h.logs.length > 0,
        totalDone: h.totalDone,
    }));

    return (
        <DashboardClient
            initialTasks={tasks}
            initialHabits={habits}
            xp={user.xp}
            streak={user.currentStreak}
            level={user.level}
        />
    );
}
