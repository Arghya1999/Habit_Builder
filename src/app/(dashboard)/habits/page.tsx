'use client';
import { useState } from 'react';

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

const mockHabits: Habit[] = [
    { id: '1', name: 'Exercise', icon: '💪', color: '#FF6B6B', currentStreak: 12, bestStreak: 21, totalCompletions: 89, todayDone: true, weekLog: [true, true, false, true, true, true, true] },
    { id: '2', name: 'Reading', icon: '📚', color: '#6C5CE7', currentStreak: 8, bestStreak: 15, totalCompletions: 64, todayDone: false, weekLog: [true, false, true, true, true, true, true] },
    { id: '3', name: 'Meditation', icon: '🧘', color: '#00CEC9', currentStreak: 15, bestStreak: 15, totalCompletions: 45, todayDone: true, weekLog: [true, true, true, true, true, true, true] },
    { id: '4', name: 'Journaling', icon: '✍️', color: '#FDCB6E', currentStreak: 5, bestStreak: 12, totalCompletions: 38, todayDone: false, weekLog: [false, true, true, true, true, true, false] },
    { id: '5', name: 'No Sugar', icon: '🍎', color: '#00B894', currentStreak: 3, bestStreak: 14, totalCompletions: 52, todayDone: true, weekLog: [true, false, false, true, true, true, true] },
    { id: '6', name: 'Sleep by 11 PM', icon: '😴', color: '#A29BFE', currentStreak: 7, bestStreak: 20, totalCompletions: 71, todayDone: false, weekLog: [true, true, true, true, true, true, true] },
    { id: '7', name: 'Drink 3L Water', icon: '💧', color: '#74B9FF', currentStreak: 10, bestStreak: 30, totalCompletions: 120, todayDone: true, weekLog: [true, true, true, true, false, true, true] },
    { id: '8', name: 'No Phone Before Bed', icon: '📵', color: '#FD79A8', currentStreak: 2, bestStreak: 7, totalCompletions: 25, todayDone: false, weekLog: [false, false, true, true, false, true, false] },
];

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const badges = [
    { name: '7-Day Warrior', icon: '🛡️', requirement: '7 day streak', unlocked: true },
    { name: '30-Day Legend', icon: '🏆', requirement: '30 day streak', unlocked: false },
    { name: 'Perfect Week', icon: '⭐', requirement: 'Complete all habits for a week', unlocked: true },
    { name: 'Early Bird', icon: '🐦', requirement: 'Complete morning routine 14 days', unlocked: true },
    { name: 'Centurion', icon: '💯', requirement: '100 total completions', unlocked: false },
    { name: 'Zen Master', icon: '☯️', requirement: 'Meditate 30 consecutive days', unlocked: false },
];

export default function HabitsPage() {
    const [habits, setHabits] = useState(mockHabits);

    const totalXP = habits.reduce((sum, h) => sum + h.totalCompletions * 10, 0);
    const level = Math.floor(totalXP / 500) + 1;
    const xpInLevel = totalXP % 500;
    const completedToday = habits.filter(h => h.todayDone).length;

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, todayDone: !h.todayDone } : h));
    };

    return (
        <>
            <div className="page-header">
                <h1>Habits 🔥</h1>
                <p>{completedToday}/{habits.length} completed today · Level {level} · {totalXP} XP</p>
            </div>

            {/* XP Bar */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>⚡ Level {level}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{xpInLevel}/500 XP to Level {level + 1}</span>
                </div>
                <div className="progress-bar" style={{ height: '10px' }}>
                    <div className="progress-bar-fill" style={{ width: `${(xpInLevel / 500) * 100}%` }} />
                </div>
            </div>

            {/* Habits Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {habits.map(habit => (
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
                                onClick={() => toggleHabit(habit.id)}
                                style={{ width: '40px', height: '40px' }}
                            >
                                {habit.todayDone ? '✓' : ''}
                            </button>
                        </div>

                        {/* Week view */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'space-between' }}>
                            {habit.weekLog.map((done, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{dayLabels[i]}</div>
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

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            <span>Total: {habit.totalCompletions}</span>
                            <span>+{habit.todayDone ? 10 : 0} XP today</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Badges */}
            <div className="dashboard-card">
                <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>🏆 Badges & Achievements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    {badges.map((badge, i) => (
                        <div key={i} style={{
                            padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                            background: badge.unlocked ? 'var(--bg-glass-strong)' : 'var(--bg-glass)',
                            opacity: badge.unlocked ? 1 : 0.5,
                            display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                            border: badge.unlocked ? '1px solid var(--border-color-hover)' : '1px solid var(--border-color)',
                        }}>
                            <span style={{ fontSize: 'var(--text-2xl)' }}>{badge.icon}</span>
                            <div>
                                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{badge.name}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                    {badge.unlocked ? '✓ Unlocked' : badge.requirement}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
