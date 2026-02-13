import { NextResponse } from 'next/server';

// GET /api/habits - fetch user habits
export async function GET() {
    const habits = [
        { id: '1', name: 'Exercise', icon: '💪', color: '#FF6B6B', currentStreak: 12, bestStreak: 21, totalCompletions: 89, todayDone: true },
        { id: '2', name: 'Reading', icon: '📚', color: '#6C5CE7', currentStreak: 8, bestStreak: 15, totalCompletions: 64, todayDone: false },
        { id: '3', name: 'Meditation', icon: '🧘', color: '#00CEC9', currentStreak: 15, bestStreak: 15, totalCompletions: 45, todayDone: true },
        { id: '4', name: 'Journaling', icon: '✍️', color: '#FDCB6E', currentStreak: 5, bestStreak: 12, totalCompletions: 38, todayDone: false },
    ];

    return NextResponse.json(habits);
}

// POST /api/habits/toggle - toggle a habit's completion for today
export async function POST(request: Request) {
    const body = await request.json();
    const { habitId, date } = body;

    if (!habitId) {
        return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }

    // TODO: Toggle habit log in database
    return NextResponse.json({
        habitId,
        date: date || new Date().toISOString().slice(0, 10),
        toggled: true,
    });
}
