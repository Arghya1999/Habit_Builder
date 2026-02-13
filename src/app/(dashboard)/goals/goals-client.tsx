'use client';
import { useState } from 'react';

interface Goal {
    id: string;
    title: string;
    description: string | null;
    category: string;
    durationDays: number;
    startDate: string;
    endDate: string;
    progress: number;
    status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ABANDONED';
}

interface GoalsClientProps {
    initialGoals: Goal[];
}

export default function GoalsClient({ initialGoals }: GoalsClientProps) {
    const [goals] = useState(initialGoals);
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
    const [showCreate, setShowCreate] = useState(false);

    const filtered = goals.filter(g => filter === 'ALL' ? true : g.status === filter);

    const calculateDaysPassed = (startDate: string | Date) => {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Health': return '🏋️';
            case 'Learning': return '💻';
            case 'Personal': return '📖';
            case 'Finance': return '💰';
            case 'Career': return '💼';
            default: return '🎯';
        }
    };

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
                {(['ALL', 'ACTIVE', 'COMPLETED'] as const).map(f => (
                    <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                        {f.charAt(0).toUpperCase() + f.slice(1).toLowerCase()} ({goals.filter(g => f === 'ALL' ? true : g.status === f).length})
                    </button>
                ))}
            </div>

            {/* Create Modal (Placeholder for now) */}
            {showCreate && (
                <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>Create New Goal</h3>
                    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Goal creation coming soon!
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Goals Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                {goals.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
                        No goals found. Create one to get started!
                    </div>
                ) : (
                    filtered.map(goal => {
                        const daysPassed = calculateDaysPassed(goal.startDate);
                        return (
                            <div key={goal.id} className="dashboard-card" style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                    <span style={{ fontSize: 'var(--text-2xl)' }}>{getCategoryIcon(goal.category)}</span>
                                    <span className={`badge ${goal.status === 'COMPLETED' ? 'badge-success' : 'badge-primary'}`}>
                                        {goal.status === 'COMPLETED' ? '✓ Completed' : `Day ${daysPassed}/${goal.durationDays}`}
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
                                    {/* Streak logic would go here if tracked on goal level */}
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                        {Math.max(0, goal.durationDays - daysPassed)} days left
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </>
    );
}
