import { NextResponse } from 'next/server';

// GET /api/tasks - fetch user tasks
export async function GET() {
    const tasks = [
        { id: '1', title: 'Complete React module - Section 5', priority: 'P1', dueDate: 'Today', completed: false, goalTitle: 'Learn React' },
        { id: '2', title: 'Morning meditation - 15 minutes', priority: 'P2', dueDate: 'Today', completed: true },
        { id: '3', title: 'Read 20 pages of Atomic Habits', priority: 'P2', dueDate: 'Today', completed: false, goalTitle: 'Read 30 Books' },
        { id: '4', title: 'Review flashcards for Spanish', priority: 'P3', dueDate: 'Today', completed: false },
        { id: '5', title: 'Write blog post draft', priority: 'P3', dueDate: 'Tomorrow', completed: false },
    ];

    return NextResponse.json(tasks);
}

// POST /api/tasks - create a new task
export async function POST(request: Request) {
    const body = await request.json();
    const { title, priority, dueDate, goalId } = body;

    if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const task = {
        id: Date.now().toString(),
        title,
        priority: priority || 'P3',
        dueDate: dueDate || 'Today',
        completed: false,
        goalId,
    };

    return NextResponse.json(task, { status: 201 });
}
