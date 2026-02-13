'use client';
import { useState } from 'react';

interface Message {
    role: 'ai' | 'user';
    content: string;
}

interface JournalEntry {
    id: string;
    date: string;
    dateLabel: string;
    mood: number;
    energy: number;
    summary: string;
    gratitude: string[];
    productivityScore: number;
}

const pastEntries: JournalEntry[] = [
    { id: '1', date: '2026-02-11', dateLabel: 'Yesterday', mood: 4, energy: 3, summary: 'Great productive day. Completed all P1 tasks. Struggled with evening routine.', gratitude: ['Got a mentor call', 'Finished a tough coding challenge', 'Good weather for running'], productivityScore: 85 },
    { id: '2', date: '2026-02-10', dateLabel: 'Feb 10', mood: 3, energy: 4, summary: 'Average day. Spent too much time on social media. Need to use phone less.', gratitude: ['Family dinner', 'Learned a new concept in React'], productivityScore: 62 },
    { id: '3', date: '2026-02-09', dateLabel: 'Feb 9', mood: 5, energy: 5, summary: 'Best day this week! Hit a new personal record in exercise. Completed all habits.', gratitude: ['PR in bench press', 'Finished Atomic Habits book', 'Called an old friend'], productivityScore: 95 },
];

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const energyEmojis = ['🪫', '😴', '😐', '⚡', '🔥'];

export default function JournalPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: "Good evening! 🌙 Let's do your daily review. How was your day overall? What went well and what was challenging?" },
    ]);
    const [input, setInput] = useState('');
    const [mood, setMood] = useState(0);
    const [energy, setEnergy] = useState(0);
    const [gratitude, setGratitude] = useState('');
    const [showChat, setShowChat] = useState(true);

    const sendMessage = () => {
        if (!input.trim()) return;
        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            const aiResponses = [
                "That's great progress! 💪 What specific tasks did you complete from your goal list today?",
                "I see. What would you do differently tomorrow to improve on that?",
                "Excellent! You're building strong momentum. Now, what are your top 3 priorities for tomorrow?",
                "Thank you for sharing! I've noted that in your journal. Remember, consistency beats perfection. Let's plan tomorrow — what time will you start your morning routine?",
            ];
            const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            setMessages(prev => [...prev, { role: 'ai', content: randomResponse }]);
        }, 1000);
    };

    return (
        <>
            <div className="page-header">
                <h1>Journal & AI Review 📝</h1>
                <p>Reflect on your day, track mood, and plan tomorrow with AI guidance</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--space-6)' }}>
                {/* Chat */}
                <div className="dashboard-card" style={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">🤖 Daily Review Chat</h3>
                        <span className="badge badge-success">Live</span>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingRight: 'var(--space-2)' }}>
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                padding: 'var(--space-3) var(--space-4)',
                                borderRadius: msg.role === 'user' ? 'var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl)' : 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-sm)',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--bg-glass-strong)',
                                fontSize: 'var(--text-sm)',
                                lineHeight: 1.6,
                            }}>
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                        <input
                            className="input"
                            placeholder="Type your response..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        />
                        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                    </div>
                </div>

                {/* Right Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Mood & Energy */}
                    <div className="dashboard-card">
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>How are you feeling?</h4>
                        <div style={{ marginBottom: 'var(--space-4)' }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>Mood</div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {moodEmojis.map((emoji, i) => (
                                    <button key={i} onClick={() => setMood(i + 1)} style={{
                                        fontSize: 'var(--text-2xl)', background: mood === i + 1 ? 'var(--bg-glass-strong)' : 'transparent',
                                        border: mood === i + 1 ? '2px solid var(--primary)' : '2px solid transparent',
                                        borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}>
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>Energy</div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                {energyEmojis.map((emoji, i) => (
                                    <button key={i} onClick={() => setEnergy(i + 1)} style={{
                                        fontSize: 'var(--text-2xl)', background: energy === i + 1 ? 'var(--bg-glass-strong)' : 'transparent',
                                        border: energy === i + 1 ? '2px solid var(--secondary)' : '2px solid transparent',
                                        borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', cursor: 'pointer',
                                        transition: 'all var(--transition-fast)',
                                    }}>
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gratitude */}
                    <div className="dashboard-card">
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>🙏 Gratitude</h4>
                        <textarea className="input" rows={3} placeholder="What are you grateful for today?" value={gratitude} onChange={e => setGratitude(e.target.value)} style={{ resize: 'vertical' }} />
                    </div>

                    {/* Past Entries */}
                    <div className="dashboard-card">
                        <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>📅 Recent Entries</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {pastEntries.map(entry => (
                                <div key={entry.id} style={{ padding: 'var(--space-3)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{entry.dateLabel}</span>
                                        <span style={{ fontSize: 'var(--text-sm)' }}>{moodEmojis[entry.mood - 1]}</span>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', lineHeight: 1.5 }}>{entry.summary}</p>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-1)' }}>
                                        Score: {entry.productivityScore}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
