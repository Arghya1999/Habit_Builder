import { NextResponse } from 'next/server';
import { sendTelegramMessage, sendTypingAction } from '@/lib/telegram';
import { chatWithAI, analyzeHabits } from '@/lib/ai';
import prisma from '@/lib/prisma';

// Telegram Update type
interface TelegramUpdate {
    update_id: number;
    message?: {
        message_id: number;
        from: {
            id: number;
            first_name: string;
            username?: string;
        };
        chat: {
            id: number;
            type: string;
        };
        text?: string;
        date: number;
    };
}

// POST /api/telegram/webhook — receives all messages from Telegram
export async function POST(request: Request) {
    try {
        const update: TelegramUpdate = await request.json();

        // Only process text messages
        if (!update.message?.text || !update.message.chat) {
            return NextResponse.json({ ok: true });
        }

        const chatId = update.message.chat.id;
        const text = update.message.text.trim();
        const firstName = update.message.from.first_name;
        const messageId = update.message.message_id;

        // Show typing indicator
        await sendTypingAction(chatId);

        // Try to find or create user by telegramChatId
        let user = null;
        try {
            user = await prisma.user.findFirst({
                where: { telegramChatId: String(chatId) },
                select: {
                    id: true,
                    name: true,
                    currentStreak: true,
                    bestStreak: true,
                    level: true,
                    xp: true,
                    habits: {
                        select: { name: true, currentStreak: true, totalDone: true, frequency: true },
                    },
                    tasks: {
                        where: { completed: false },
                        select: { title: true, priority: true, completed: true, dueDate: true },
                        take: 10,
                    },
                },
            });
        } catch {
            // DB not available — continue without user data
        }

        // Handle commands
        if (text.startsWith('/')) {
            const command = text.split(' ')[0].toLowerCase().split('@')[0];
            let response = '';

            switch (command) {
                case '/start':
                    response = getStartMessage(firstName, chatId);
                    if (!user) {
                        // Auto-register: create user or update existing
                        try {
                            const existing = await prisma.user.findFirst({
                                where: { telegramChatId: String(chatId) },
                            });
                            if (!existing) {
                                await prisma.user.create({
                                    data: {
                                        email: `telegram_${chatId}@routineforge.app`,
                                        name: firstName,
                                        telegramChatId: String(chatId),
                                        reminderLevel: 'TELEGRAM',
                                    },
                                });
                            }
                        } catch {
                            // User creation might fail if DB not set up — that's okay
                        }
                    }
                    break;

                case '/status':
                    response = getStatusMessage(user, firstName);
                    break;

                case '/habits':
                    if (user?.habits?.length) {
                        response = await analyzeHabits(user.habits.map((h: { name: string; currentStreak: number; totalDone: number; frequency: string }) => ({
                            name: h.name,
                            streak: h.currentStreak,
                            totalDone: h.totalDone,
                            frequency: h.frequency,
                        })));
                    } else {
                        response = '📋 No habits tracked yet! Add some habits in the RoutineForge app and I\'ll give you analysis and tips.';
                    }
                    break;

                case '/tasks':
                    response = getTasksMessage(user);
                    break;

                case '/help':
                    response = getHelpMessage();
                    break;

                default:
                    response = `❓ Unknown command: <code>${command}</code>\n\nType /help to see available commands.`;
            }

            await sendTelegramMessage(chatId, response, 'HTML', messageId);
            return NextResponse.json({ ok: true });
        }

        // Free-text message → AI conversation
        const aiResponse = await chatWithAI({
            userMessage: text,
            userData: user ? {
                name: user.name || firstName,
                currentStreak: user.currentStreak,
                bestStreak: user.bestStreak,
                level: user.level,
                xp: user.xp,
                habits: user.habits?.map((h: { name: string; currentStreak: number; totalDone: number }) => ({
                    name: h.name,
                    streak: h.currentStreak,
                    totalDone: h.totalDone,
                })),
                tasks: user.tasks?.map((t: { title: string; priority: string; completed: boolean; dueDate: Date | null }) => ({
                    title: t.title,
                    priority: t.priority,
                    completed: t.completed,
                    dueDate: t.dueDate?.toISOString().split('T')[0],
                })),
            } : { name: firstName },
        });

        await sendTelegramMessage(chatId, aiResponse, 'HTML', messageId);
        return NextResponse.json({ ok: true });

    } catch (err) {
        console.error('[Webhook Error]', err);
        // Always return 200 to Telegram to prevent retries
        return NextResponse.json({ ok: true });
    }
}

// ── Command Response Generators ──────────────────────────────────────

function getStartMessage(firstName: string, chatId: number): string {
    return [
        `👋 <b>Welcome to RoutineForge, ${firstName}!</b>`,
        '',
        'I\'m your AI productivity coach. I can help you:',
        '',
        '🔥 Track and analyze your habits',
        '📋 Review your pending tasks',
        '💪 Stay motivated and accountable',
        '🧠 Give personalized productivity tips',
        '',
        `Your Chat ID: <code>${chatId}</code>`,
        '',
        '<b>Commands:</b>',
        '/status — Your streak and stats',
        '/habits — AI analysis of your habits',
        '/tasks — View pending tasks',
        '/help — All commands',
        '',
        'Or just send me a message and I\'ll chat with you as your AI coach! 🚀',
    ].join('\n');
}

function getStatusMessage(user: Record<string, unknown> | null, firstName: string): string {
    if (!user) {
        return `Hey ${firstName}! 👋\n\nYou're not linked to a RoutineForge account yet.\n\n<b>To connect:</b>\n1. Go to Settings in the RoutineForge app\n2. Enter your Chat ID and save\n\nOr just start chatting with me — I'll still be your AI coach!`;
    }

    const u = user as { name?: string; currentStreak?: number; bestStreak?: number; level?: number; xp?: number; habits?: unknown[]; tasks?: unknown[] };
    return [
        `📊 <b>Your Status, ${u.name || firstName}</b>`,
        '',
        `⚡ Current Streak: <b>${u.currentStreak || 0}</b> days`,
        `🏆 Best Streak: <b>${u.bestStreak || 0}</b> days`,
        `📈 Level: <b>${u.level || 1}</b> (${u.xp || 0} XP)`,
        `🔥 Active Habits: <b>${u.habits?.length || 0}</b>`,
        `📋 Pending Tasks: <b>${u.tasks?.length || 0}</b>`,
        '',
        u.currentStreak && u.currentStreak > 0
            ? '🎉 Keep that streak going! You\'re doing amazing!'
            : '💪 Today is a great day to start a new streak!',
    ].join('\n');
}

function getTasksMessage(user: Record<string, unknown> | null): string {
    if (!user) {
        return '📋 Connect your RoutineForge account to see your tasks!\n\nGo to Settings → enter your Chat ID.';
    }

    const tasks = (user as { tasks?: { title: string; priority: string; dueDate?: Date | null }[] }).tasks || [];
    if (!tasks.length) {
        return '✅ You have no pending tasks. Great job staying on top of things! 🎉';
    }

    const priorityIcons: Record<string, string> = { P1: '🔴', P2: '🟠', P3: '🟡', P4: '🟢' };

    const lines = tasks.map(t => {
        const icon = priorityIcons[t.priority] || '⚪';
        const due = t.dueDate ? ` (due: ${new Date(t.dueDate).toLocaleDateString()})` : '';
        return `${icon} ${t.title}${due}`;
    });

    return [
        `📋 <b>Pending Tasks (${tasks.length})</b>`,
        '',
        ...lines,
        '',
        '💡 <i>Type "help me prioritize" for AI suggestions!</i>',
    ].join('\n');
}

function getHelpMessage(): string {
    return [
        '🤖 <b>RoutineForge Bot Commands</b>',
        '',
        '/start — Welcome & setup',
        '/status — Your streak, level, and stats',
        '/habits — AI analysis of your habits',
        '/tasks — View pending tasks',
        '/help — This help message',
        '',
        '<b>AI Chat:</b>',
        'Just send any message and I\'ll respond as your AI productivity coach!',
        '',
        'Try these:',
        '• "How are my habits doing?"',
        '• "Help me prioritize my tasks"',
        '• "Give me a morning routine tip"',
        '• "I\'m struggling with consistency"',
    ].join('\n');
}
