'use client';
import { useState } from 'react';
import { toggleHabit } from '@/app/actions/dashboard';

interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    currentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    todayDone: boolean;
    weekLog: boolean[]; // last 7 days
}

interface HabitsClientProps {
    initialHabits: Habit[];
    level: number;
    xp: number;
}

export default function HabitsClient({ initialHabits, level, xp }: HabitsClientProps) {
    const [habits, setHabits] = useState(initialHabits);

    const xpInLevel = xp % 1000; // Assuming 1000 XP per level
    const completedToday = habits.filter(h => h.todayDone).length;

    const handleToggleHabit = async (id: string) => {
        // Optimistic update
        setHabits(prev => prev.map(h => h.id === id ? { ...h, todayDone: !h.todayDone } : h));
        await toggleHabit(id);
    };

    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Note: Accurate day labels require knowing which day "index 0" is, usually 6 days ago.
    // For simplicity, we'll just label them "Day -6" .. "Today" implicitly or just use simple initials based on today.
    const getDayLabels = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date().getDay();
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            labels.push(days[d.getDay()]);
        }
        return labels;
    };
    const dynamicDayLabels = getDayLabels();


    return (
        <>
            <div className="page-header">
                <h1>Habits 🔥</h1>
                <p>{completedToday}/{habits.length} completed today · Level {level} · {xp} XP</p>
            </div>

            {/* XP Bar */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>⚡ Level {level}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{xpInLevel}/1000 XP to Level {level + 1}</span>
                </div>
                <div className="progress-bar" style={{ height: '10px' }}>
                    <div className="progress-bar-fill" style={{ width: `${(xpInLevel / 1000) * 100}%` }} />
                </div>
            </div>

            {/* Habits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {habits.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)', gridColumn: '1/-1', textAlign: 'center' }}>
                        No habits found. Add one from the Dashboard!
                    </div>
                ) : habits.map(habit => (
                    <div key={habit.id} className="dashboard-card" style={{ padding: 'var(--space-5)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-2xl)' }}>{habit.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{habit.name}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                        🔥 {habit.currentStreak} days · Best: {habit.bestStreak}
                                    </div>
                                </div>
                            </div>
                            <button
                                className={`habit-check-btn ${habit.todayDone ? 'done' : ''}`}
                                onClick={() => handleToggleHabit(habit.id)}
                                style={{ width: '40px', height: '40px' }}
                            >
                                {habit.todayDone ? '✓' : ''}
                            </button>
                        </div>

                        {/* Week view */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between' }}>
                            {habit.weekLog.map((done, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{dynamicDayLabels[i]}</div>
                                    <div style={{
                                        width: '28px', height: '28px', borderRadius: '50%',
                                        background: done ? `${habit.color}30` : 'var(--bg-glass)',
                                        border: `2px solid ${done ? habit.color : 'var(--border-color)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '12px', color: done ? habit.color : 'transparent',
                                    }}>
                                        ✓
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
