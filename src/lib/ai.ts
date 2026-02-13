// ── Google Gemini AI Service ─────────────────────────────────────────
// Free tier: 15 requests/min, no credit card needed.
// Get your API key at: https://aistudio.google.com

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are RoutineForge AI Coach — a friendly, motivational productivity coach inside the RoutineForge app. You communicate via Telegram.

Your personality:
- Warm, encouraging, and concise (keep messages under 200 words)
- Use relevant emojis sparingly (1–3 per message)
- Be actionable — give specific advice, not vague platitudes
- Celebrate wins, no matter how small
- Be honest but kind when habits are slipping

You help users with:
- Building and maintaining daily habits and routines
- Task prioritization and time management
- Goal setting and milestone tracking
- Motivation and accountability
- Journaling and self-reflection
- Productivity tips and techniques

Important rules:
- Always respond in the same language the user writes in
- If the user shares their habit/task data, reference it specifically
- Never make up data — if you don't have info, ask for it
- Keep formatting Telegram-friendly (use HTML: <b>, <i>, <code>)
- For lists, use simple line breaks with emojis, not complex formatting`;

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface ChatOptions {
    userMessage: string;
    conversationHistory?: GeminiMessage[];
    userData?: {
        name?: string;
        currentStreak?: number;
        bestStreak?: number;
        level?: number;
        xp?: number;
        habits?: { name: string; streak: number; totalDone: number }[];
        tasks?: { title: string; priority: string; completed: boolean; dueDate?: string }[];
    };
}

export async function chatWithAI(options: ChatOptions): Promise<string> {
    const { userMessage, conversationHistory = [], userData } = options;

    if (!GEMINI_API_KEY) {
        return '⚠️ AI is not configured yet. The admin needs to set GEMINI_API_KEY in the environment variables.';
    }

    // Build context from user data
    let contextParts = '';
    if (userData) {
        const parts: string[] = [];
        if (userData.name) parts.push(`User's name: ${userData.name}`);
        if (userData.currentStreak !== undefined) parts.push(`Current streak: ${userData.currentStreak} days`);
        if (userData.bestStreak !== undefined) parts.push(`Best streak: ${userData.bestStreak} days`);
        if (userData.level !== undefined) parts.push(`Level: ${userData.level} (${userData.xp} XP)`);

        if (userData.habits?.length) {
            parts.push(`\nActive habits:\n${userData.habits.map(h => `- ${h.name}: ${h.streak} day streak, ${h.totalDone} total completions`).join('\n')}`);
        }

        if (userData.tasks?.length) {
            const pending = userData.tasks.filter(t => !t.completed);
            if (pending.length) {
                parts.push(`\nPending tasks:\n${pending.map(t => `- [${t.priority}] ${t.title}${t.dueDate ? ` (due: ${t.dueDate})` : ''}`).join('\n')}`);
            }
        }

        if (parts.length) {
            contextParts = `\n\nCurrent user data:\n${parts.join('\n')}`;
        }
    }

    const contents: GeminiMessage[] = [
        ...conversationHistory,
        {
            role: 'user',
            parts: [{ text: userMessage }],
        },
    ];

    try {
        const res = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT + contextParts }],
                },
                contents,
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                },
            }),
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error('[AI] Gemini API error:', res.status, errorData);
            if (res.status === 429) {
                return '⏳ I\'m getting a lot of messages right now. Please try again in a minute!';
            }
            return '❌ Sorry, I had trouble processing that. Please try again.';
        }

        const data = await res.json() as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
        };

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            return '🤔 I couldn\'t generate a response. Could you rephrase that?';
        }

        return reply.trim();
    } catch (err) {
        console.error('[AI] Error:', err);
        return '❌ Something went wrong with the AI service. Please try again later.';
    }
}

// Generate a motivational message for cron reminders
export async function generateMotivation(userData?: {
    name?: string;
    currentStreak?: number;
    habits?: { name: string; streak: number }[];
}): Promise<string> {
    const context = userData
        ? `The user${userData.name ? ` (${userData.name})` : ''} has a ${userData.currentStreak || 0}-day streak.${userData.habits?.length ? ` Their habits: ${userData.habits.map(h => `${h.name} (${h.streak} days)`).join(', ')}.` : ''}`
        : 'Generate a general motivation message.';

    return chatWithAI({
        userMessage: `${context} Send a short motivational message (2-3 sentences max) to encourage them to check in on their habits today. Be specific if you have their data.`,
    });
}

// Analyze habits and give recommendations
export async function analyzeHabits(habits: { name: string; streak: number; totalDone: number; frequency: string }[]): Promise<string> {
    if (!habits.length) {
        return '📋 You don\'t have any habits tracked yet. Start by adding a habit in the app!';
    }

    const habitSummary = habits.map(h =>
        `- ${h.name}: ${h.streak} day streak, ${h.totalDone} total, frequency: ${h.frequency}`
    ).join('\n');

    return chatWithAI({
        userMessage: `Analyze these habits and give 2-3 specific, actionable recommendations:\n${habitSummary}\n\nFocus on: which habits are strong, which need attention, and one new tip.`,
    });
}
