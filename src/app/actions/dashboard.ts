'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTask(title: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.task.create({
        data: {
            userId: session.user.id,
            title,
            priority: 'P3'
        }
    });

    revalidatePath('/dashboard');
}

export async function createHabit(name: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.habit.create({
        data: {
            userId: session.user.id,
            name,
            frequency: 'daily'
        }
    });

    revalidatePath('/dashboard');
}

export async function toggleTask(taskId: string, completed: boolean) {
    const session = await auth();
    if (!session?.user?.email) return;

    await prisma.task.update({
        where: { id: taskId },
        data: { completed },
    });

    revalidatePath('/dashboard');
}

export async function toggleHabit(habitId: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if log exists for today
    const existingLog = await prisma.habitLog.findUnique({
        where: {
            habitId_date: {
                habitId,
                date: today,
            }
        }
    });

    if (existingLog) {
        // Untoggle: remove log and decrement streak/count
        await prisma.habitLog.delete({
            where: { id: existingLog.id }
        });

        // Decrement streak/total (simplified logic - real streak recalc is harder)
        await prisma.habit.update({
            where: { id: habitId },
            data: {
                totalDone: { decrement: 1 },
                // Not modifying streak on untoggle for simplicity in this MVP step, 
                // requires specific logic to see if streak was broken
            }
        });
    } else {
        // Toggle: create log and increment
        await prisma.habitLog.create({
            data: {
                habitId,
                date: today,
                completed: true
            }
        });

        await prisma.habit.update({
            where: { id: habitId },
            data: {
                totalDone: { increment: 1 },
                currentStreak: { increment: 1 } // Naive increment
            }
        });
    }

    revalidatePath('/dashboard');
}
