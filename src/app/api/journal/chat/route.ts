import { NextResponse } from 'next/server';

// POST /api/journal/chat - AI journal conversation
export async function POST(request: Request) {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // TODO: Integrate with OpenAI GPT-4 or local LLM
    // For now, return contextual mock responses
    const responses = [
        "That's great progress! 💪 What specific tasks did you complete from your goal list today?",
        "I see. What would you do differently tomorrow to improve on that?",
        "Excellent! You're building strong momentum. What are your top 3 priorities for tomorrow?",
        "Thank you for sharing! I've noted that in your journal. Remember, consistency beats perfection.",
        "That sounds like a productive day! Did you manage to stick to your routine today?",
        "I noticed you've been on a 12-day streak! What's helping you stay consistent?",
        "Let's plan tomorrow — what time will you start your morning routine?",
    ];

    const aiResponse = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
        role: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
    });
}
