import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import GoalsClient from "./goals-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function GoalsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) redirect("/login");

    const goals = await prisma.goal.findMany({
        where: { userId: user.id }, // Corrected query to use userId directly or user relation
        orderBy: { createdAt: 'desc' },
    });

    const serializedGoals = goals.map((g: any) => ({
        ...g,
        startDate: g.startDate.toISOString(),
        endDate: g.endDate.toISOString(),
        createdAt: g.createdAt.toISOString(),
        updatedAt: g.updatedAt.toISOString(),
    }));

    return <GoalsClient initialGoals={serializedGoals} />;
}
