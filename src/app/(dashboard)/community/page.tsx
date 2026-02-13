'use client';
import { useState } from 'react';

interface Partner {
    id: string;
    name: string;
    avatar: string;
    level: number;
    streak: number;
    todayCompleted: number;
    todayTotal: number;
    status: 'online' | 'away' | 'offline';
    mutualGoals: string[];
}

interface Challenge {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    participants: number;
    maxParticipants: number;
    daysLeft: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
    xpReward: number;
    joined: boolean;
    progress?: number;
}

const mockPartners: Partner[] = [
    { id: '1', name: 'Sarah K.', avatar: '👩‍💻', level: 7, streak: 15, todayCompleted: 5, todayTotal: 6, status: 'online', mutualGoals: ['Fitness', 'Reading'] },
    { id: '2', name: 'Marcus T.', avatar: '🧑‍🎨', level: 5, streak: 8, todayCompleted: 3, todayTotal: 5, status: 'online', mutualGoals: ['Learning'] },
    { id: '3', name: 'Priya S.', avatar: '👩‍🔬', level: 9, streak: 23, todayCompleted: 7, todayTotal: 7, status: 'away', mutualGoals: ['Meditation', 'Fitness'] },
    { id: '4', name: 'Alex W.', avatar: '🧑‍💼', level: 3, streak: 4, todayCompleted: 2, todayTotal: 4, status: 'offline', mutualGoals: ['Career'] },
];

const mockChallenges: Challenge[] = [
    { id: '1', title: '30-Day Morning Warrior', description: 'Wake up before 6 AM and complete a morning routine every day for 30 days.', icon: '🌅', category: 'Routine', participants: 1284, maxParticipants: 2000, daysLeft: 22, difficulty: 'Medium', xpReward: 500, joined: true, progress: 27 },
    { id: '2', title: '100 Push-ups Challenge', description: 'Complete 100 push-ups every day for 14 days. Any rep scheme.', icon: '💪', category: 'Fitness', participants: 876, maxParticipants: 1500, daysLeft: 10, difficulty: 'Hard', xpReward: 750, joined: true, progress: 43 },
    { id: '3', title: 'Digital Detox Weekend', description: 'No social media from Friday evening to Monday morning. Track check-ins.', icon: '📵', category: 'Wellness', participants: 432, maxParticipants: 1000, daysLeft: 3, difficulty: 'Easy', xpReward: 250, joined: false },
    { id: '4', title: 'Read 5 Books in 30 Days', description: 'Read 5 complete books within 30 days. Log each session.', icon: '📚', category: 'Learning', participants: 654, maxParticipants: 1000, daysLeft: 18, difficulty: 'Medium', xpReward: 400, joined: false },
    { id: '5', title: '90-Day Body Transformation', description: 'Complete daily workouts, track nutrition, and log progress photos weekly.', icon: '🏆', category: 'Fitness', participants: 2100, maxParticipants: 3000, daysLeft: 67, difficulty: 'Epic', xpReward: 2000, joined: false },
    { id: '6', title: 'Meditation Marathon', description: 'Meditate for at least 10 minutes every day for 21 days straight.', icon: '🧘', category: 'Wellness', participants: 941, maxParticipants: 1500, daysLeft: 14, difficulty: 'Easy', xpReward: 300, joined: false },
];

const difficultyColors: Record<string, string> = {
    Easy: 'var(--success)',
    Medium: 'var(--warning)',
    Hard: 'var(--danger)',
    Epic: 'var(--accent)',
};

const statusColors: Record<string, string> = {
    online: 'var(--success)',
    away: 'var(--warning)',
    offline: 'var(--text-tertiary)',
};

export default function CommunityPage() {
    const [tab, setTab] = useState<'partners' | 'challenges' | 'find'>('partners');
    const [challenges, setChallenges] = useState(mockChallenges);

    const joinChallenge = (id: string) => {
        setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: true, participants: c.participants + 1, progress: 0 } : c));
    };

    return (
        <>
            <div className="page-header">
                <h1>Community 👥</h1>
                <p>Connect with accountability partners and join community challenges</p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {[
                    { key: 'partners', label: '👥 Partners', count: mockPartners.length },
                    { key: 'challenges', label: '🏆 Challenges', count: challenges.filter(c => c.joined).length },
                    { key: 'find', label: '🔍 Discover' },
                ].map(t => (
                    <button key={t.key} className={`btn ${tab === t.key ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab(t.key as typeof tab)}>
                        {t.label} {t.count !== undefined && `(${t.count})`}
                    </button>
                ))}
            </div>

            {tab === 'partners' && (
                <>
                    {/* Partner Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                        {[
                            { label: 'Active Partners', value: mockPartners.filter(p => p.status !== 'offline').length.toString(), icon: '🤝' },
                            { label: 'Combined Streak', value: mockPartners.reduce((s, p) => s + p.streak, 0).toString(), icon: '🔥' },
                            { label: 'Avg Completion', value: Math.round(mockPartners.reduce((s, p) => s + (p.todayCompleted / p.todayTotal * 100), 0) / mockPartners.length) + '%', icon: '📊' },
                        ].map((stat, i) => (
                            <div key={i} className="dashboard-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                                <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>{stat.icon}</div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary-light)' }}>{stat.value}</div>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Partner Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                        {mockPartners.map(partner => (
                            <div key={partner.id} className="dashboard-card" style={{ padding: 'var(--space-5)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-glass-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-xl)' }}>
                                            {partner.avatar}
                                        </div>
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: statusColors[partner.status], border: '2px solid var(--bg-card)' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>{partner.name}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Level {partner.level} · 🔥 {partner.streak} days</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Today&apos;s Progress</span>
                                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-light)' }}>{partner.todayCompleted}/{partner.todayTotal}</span>
                                </div>
                                <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                                    <div className="progress-bar-fill" style={{ width: `${(partner.todayCompleted / partner.todayTotal) * 100}%` }} />
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
                                    {partner.mutualGoals.map(g => (
                                        <span key={g} className="badge badge-primary" style={{ fontSize: '10px' }}>{g}</span>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>💬 Message</button>
                                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>👋 Nudge</button>
                                </div>
                            </div>
                        ))}

                        {/* Add Partner Card */}
                        <div className="dashboard-card" style={{
                            padding: 'var(--space-5)', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', minHeight: 200,
                            border: '2px dashed var(--border-color)', cursor: 'pointer',
                        }}>
                            <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>➕</div>
                            <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>Add Partner</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                Invite a friend or find a partner
                            </div>
                        </div>
                    </div>
                </>
            )}

            {tab === 'challenges' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                    {challenges.filter(c => c.joined).map(challenge => (
                        <div key={challenge.id} className="dashboard-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-2xl)' }}>{challenge.icon}</span>
                                <span className="badge badge-success">Joined</span>
                            </div>
                            <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{challenge.title}</h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{challenge.description}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Progress</span>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-light)' }}>{challenge.progress}%</span>
                            </div>
                            <div className="progress-bar" style={{ marginBottom: 'var(--space-3)' }}>
                                <div className="progress-bar-fill" style={{ width: `${challenge.progress}%` }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                <span>👥 {challenge.participants} participants</span>
                                <span>⏰ {challenge.daysLeft} days left</span>
                                <span>⚡ {challenge.xpReward} XP</span>
                            </div>
                        </div>
                    ))}
                    {challenges.filter(c => c.joined).length === 0 && (
                        <div className="dashboard-card" style={{ padding: 'var(--space-8)', textAlign: 'center', gridColumn: '1 / -1' }}>
                            <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-3)' }}>🏆</div>
                            <h3 style={{ marginBottom: 'var(--space-2)' }}>No Active Challenges</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Head to Discover to join community challenges!</p>
                        </div>
                    )}
                </div>
            )}

            {tab === 'find' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
                    {challenges.filter(c => !c.joined).map(challenge => (
                        <div key={challenge.id} className="dashboard-card" style={{ padding: 'var(--space-5)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-2xl)' }}>{challenge.icon}</span>
                                <span style={{
                                    padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 700,
                                    background: `color-mix(in srgb, ${difficultyColors[challenge.difficulty]} 15%, transparent)`,
                                    color: difficultyColors[challenge.difficulty],
                                }}>
                                    {challenge.difficulty}
                                </span>
                            </div>
                            <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-2)' }}>{challenge.title}</h4>
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>{challenge.description}</p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Spots filled</span>
                                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-secondary)' }}>{challenge.participants}/{challenge.maxParticipants}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 4, marginBottom: 'var(--space-3)' }}>
                                <div className="progress-bar-fill" style={{ width: `${(challenge.participants / challenge.maxParticipants) * 100}%`, background: 'var(--secondary)' }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                    ⏰ {challenge.daysLeft} days left · ⚡ {challenge.xpReward} XP
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={() => joinChallenge(challenge.id)}>Join</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
