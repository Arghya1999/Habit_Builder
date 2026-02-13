import { NextResponse } from 'next/server';

// GET /api/goals - fetch user goals
export async function GET() {
    // TODO: Get authenticated user from session
    // const session = await getServerSession();
    // const goals = await prisma.goal.findMany({ where: { userId: session.user.id } });

    // Mock data for now
    const goals = [
        { id: '1', title: 'Learn React & Next.js', category: 'Learning', categoryIcon: '💻', durationDays: 60, daysPassed: 41, progress: 68, currentStreak: 12, status: 'active' },
        { id: '2', title: '90-Day Fitness Transformation', category: 'Health', categoryIcon: '🏋️', durationDays: 90, daysPassed: 38, progress: 42, currentStreak: 8, status: 'active' },
        { id: '3', title: 'Read 30 Books This Year', category: 'Personal', categoryIcon: '📖', durationDays: 365, daysPassed: 45, progress: 23, currentStreak: 5, status: 'active' },
    ];

    return NextResponse.json(goals);
}

// POST /api/goals - create a new goal
export async function POST(request: Request) {
    const body = await request.json();

    const { title, description, category, durationDays, startDate } = body;

    if (!title || !durationDays) {
        return NextResponse.json(
            { error: 'Title and duration are required' },
            { status: 400 }
        );
    }

    // TODO: Create goal in database
    // const goal = await prisma.goal.create({ data: { ... } });

    const goal = {
        id: Date.now().toString(),
        title,
        description,
        category: category || 'Personal',
        durationDays,
        startDate: startDate || new Date().toISOString(),
        progress: 0,
        status: 'active',
    };

    return NextResponse.json(goal, { status: 201 });
}
