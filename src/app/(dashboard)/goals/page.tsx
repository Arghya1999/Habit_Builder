'use client';
import { useState } from 'react';

interface Goal {
    id: string;
    title: string;
    description: string;
    category: string;
    categoryIcon: string;
    durationDays: number;
    daysPassed: number;
    progress: number;
    currentStreak: number;
    status: 'active' | 'completed' | 'paused';
}

const mockGoals: Goal[] = [
    { id: '1', title: 'Learn React & Next.js', description: 'Complete full-stack web development course with hands-on projects', category: 'Learning', categoryIcon: '💻', durationDays: 60, daysPassed: 41, progress: 68, currentStreak: 12, status: 'active' },
    { id: '2', title: '90-Day Fitness Transformation', description: 'Workout 5x/week, track macros, lose 10kg', category: 'Health', categoryIcon: '🏋️', durationDays: 90, daysPassed: 38, progress: 42, currentStreak: 8, status: 'active' },
    { id: '3', title: 'Read 30 Books This Year', description: 'Read at least 20 pages daily across non-fiction and fiction', category: 'Personal', categoryIcon: '📖', durationDays: 365, daysPassed: 45, progress: 23, currentStreak: 5, status: 'active' },
    { id: '4', title: 'Learn Spanish B1', description: 'Practice daily on Duolingo + conversation practice 3x/week', category: 'Learning', categoryIcon: '🇪🇸', durationDays: 120, daysPassed: 20, progress: 17, currentStreak: 20, status: 'active' },
    { id: '5', title: '30-Day Meditation Challenge', description: '15 minutes mindful meditation every morning', category: 'Health', categoryIcon: '🧘', durationDays: 30, daysPassed: 30, progress: 100, currentStreak: 30, status: 'completed' },
];

export default function GoalsPage() {
    const [goals] = useState(mockGoals);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [showCreate, setShowCreate] = useState(false);

    const filtered = goals.filter(g => filter === 'all' ? true : g.status === filter);

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Goals & Challenges 🎯</h1>
                    <p>Track your long-term goals and multi-day challenges</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>+ New Goal</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {(['all', 'active', 'completed'] as const).map(f => (
                    <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1)} ({goals.filter(g => f === 'all' ? true : g.status === f).length})
                    </button>
                ))}
            </div>

            {/* Create Modal */}
            {showCreate && (
                <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>Create New Goal</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Goal Title</label>
                            <input className="input" placeholder="e.g., Learn Python in 60 days" />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Category</label>
                            <select className="input">
                                <option>Health</option><option>Career</option><option>Learning</option><option>Finance</option><option>Personal</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Duration (days)</label>
                            <input className="input" type="number" placeholder="60" defaultValue={60} />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Start Date</label>
                            <input className="input" type="date" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Description</label>
                            <textarea className="input" rows={3} placeholder="Describe your goal and what success looks like..." style={{ resize: 'vertical' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                        <button className="btn btn-primary">Create Goal</button>
                    </div>
                </div>
            )}

            {/* Goals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                {filtered.map(goal => (
                    <div key={goal.id} className="dashboard-card" style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                            <span style={{ fontSize: 'var(--text-2xl)' }}>{goal.categoryIcon}</span>
                            <span className={`badge ${goal.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                                {goal.status === 'completed' ? '✓ Completed' : `Day ${goal.daysPassed}/${goal.durationDays}`}
                            </span>
                        </div>
                        <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{goal.title}</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{goal.description}</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Progress</span>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary-light)' }}>{goal.progress}%</span>
                        </div>
                        <div className="progress-bar" style={{ marginBottom: 'var(--space-4)' }}>
                            <div className="progress-bar-fill" style={{ width: `${goal.progress}%` }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                🔥 {goal.currentStreak} day streak
                            </div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                {goal.durationDays - goal.daysPassed} days left
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
