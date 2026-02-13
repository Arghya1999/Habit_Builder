'use client';
import { useState } from 'react';

interface LeaderboardUser {
    rank: number;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    streak: number;
    habitsCompleted: number;
    goalsCompleted: number;
    isYou?: boolean;
    change: 'up' | 'down' | 'same' | 'new';
}

const mockLeaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Priya S.', avatar: '👩‍🔬', level: 12, xp: 8450, streak: 45, habitsCompleted: 312, goalsCompleted: 8, change: 'same' },
    { rank: 2, name: 'Jordan M.', avatar: '🧑‍🚀', level: 11, xp: 7920, streak: 38, habitsCompleted: 287, goalsCompleted: 7, change: 'up' },
    { rank: 3, name: 'Sarah K.', avatar: '👩‍💻', level: 10, xp: 7100, streak: 31, habitsCompleted: 264, goalsCompleted: 6, change: 'up' },
    { rank: 4, name: 'You', avatar: '⚡', level: 5, xp: 2450, streak: 12, habitsCompleted: 89, goalsCompleted: 2, isYou: true, change: 'up' },
    { rank: 5, name: 'Marcus T.', avatar: '🧑‍🎨', level: 5, xp: 2380, streak: 8, habitsCompleted: 76, goalsCompleted: 2, change: 'down' },
    { rank: 6, name: 'Emily R.', avatar: '👩‍🏫', level: 4, xp: 2100, streak: 10, habitsCompleted: 65, goalsCompleted: 1, change: 'same' },
    { rank: 7, name: 'Alex W.', avatar: '🧑‍💼', level: 3, xp: 1650, streak: 4, habitsCompleted: 48, goalsCompleted: 1, change: 'down' },
    { rank: 8, name: 'Luna C.', avatar: '👩‍🎤', level: 3, xp: 1520, streak: 6, habitsCompleted: 42, goalsCompleted: 1, change: 'new' },
    { rank: 9, name: 'Dev P.', avatar: '🧑‍💻', level: 2, xp: 980, streak: 3, habitsCompleted: 28, goalsCompleted: 0, change: 'up' },
    { rank: 10, name: 'Mia Z.', avatar: '👩‍🍳', level: 2, xp: 870, streak: 5, habitsCompleted: 24, goalsCompleted: 0, change: 'new' },
];

const changeIcons: Record<string, string> = { up: '▲', down: '▼', same: '—', new: '★' };
const changeColors: Record<string, string> = { up: 'var(--success)', down: 'var(--danger)', same: 'var(--text-tertiary)', new: 'var(--accent)' };

export default function LeaderboardPage() {
    const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

    const you = mockLeaderboard.find(u => u.isYou)!;

    return (
        <>
            <div className="page-header">
                <h1>Leaderboard 🏆</h1>
                <p>Compete with the community and climb the ranks</p>
            </div>

            {/* Timeframe Selector */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                {(['weekly', 'monthly', 'alltime'] as const).map(t => (
                    <button key={t} className={`btn ${timeframe === t ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTimeframe(t)}>
                        {t === 'alltime' ? 'All Time' : t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {/* Top 3 Podium */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', padding: 'var(--space-4) 0' }}>
                {/* 2nd Place */}
                <div style={{ textAlign: 'center', flex: 1, maxWidth: 160 }}>
                    <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>{mockLeaderboard[1].avatar}</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>{mockLeaderboard[1].name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>{mockLeaderboard[1].xp.toLocaleString()} XP</div>
                    <div style={{
                        height: 80, background: 'linear-gradient(to top, rgba(192,192,192,0.2), rgba(192,192,192,0.05))',
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(192,192,192,0.2)', borderBottom: 'none',
                    }}>
                        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'silver' }}>🥈</span>
                    </div>
                </div>

                {/* 1st Place */}
                <div style={{ textAlign: 'center', flex: 1, maxWidth: 180 }}>
                    <div style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-1)' }}>{mockLeaderboard[0].avatar}</div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-base)', marginBottom: 2 }}>{mockLeaderboard[0].name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>{mockLeaderboard[0].xp.toLocaleString()} XP</div>
                    <div style={{
                        height: 120, background: 'linear-gradient(to top, rgba(255,215,0,0.2), rgba(255,215,0,0.05))',
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(255,215,0,0.2)', borderBottom: 'none',
                        boxShadow: '0 0 30px rgba(255,215,0,0.1)',
                    }}>
                        <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800 }}>👑</span>
                    </div>
                </div>

                {/* 3rd Place */}
                <div style={{ textAlign: 'center', flex: 1, maxWidth: 160 }}>
                    <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-1)' }}>{mockLeaderboard[2].avatar}</div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 2 }}>{mockLeaderboard[2].name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>{mockLeaderboard[2].xp.toLocaleString()} XP</div>
                    <div style={{
                        height: 60, background: 'linear-gradient(to top, rgba(205,127,50,0.2), rgba(205,127,50,0.05))',
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(205,127,50,0.2)', borderBottom: 'none',
                    }}>
                        <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>🥉</span>
                    </div>
                </div>
            </div>

            {/* Your Position Card */}
            <div className="dashboard-card" style={{
                padding: 'var(--space-4)', marginBottom: 'var(--space-6)',
                border: '1px solid var(--primary)', background: 'rgba(108, 92, 231, 0.08)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--primary-light)', width: 40, textAlign: 'center' }}>#{you.rank}</div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)' }}>
                        {you.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700 }}>{you.name} <span className="badge badge-primary" style={{ marginLeft: 4 }}>That&apos;s you!</span></div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Level {you.level} · 🔥 {you.streak} days · {you.xp.toLocaleString()} XP</div>
                    </div>
                    <span style={{ color: changeColors[you.change], fontWeight: 700, fontSize: 'var(--text-sm)' }}>{changeIcons[you.change]}</span>
                </div>
            </div>

            {/* Full Rankings */}
            <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Full Rankings</h3>
                </div>
                {mockLeaderboard.map((user, i) => (
                    <div key={user.rank} style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                        padding: 'var(--space-3) var(--space-5)',
                        borderBottom: i < mockLeaderboard.length - 1 ? '1px solid var(--border-color)' : 'none',
                        background: user.isYou ? 'rgba(108, 92, 231, 0.05)' : 'transparent',
                    }}>
                        <div style={{ width: 32, textAlign: 'center', fontWeight: 700, fontSize: 'var(--text-sm)', color: user.rank <= 3 ? 'var(--primary-light)' : 'var(--text-tertiary)' }}>
                            {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                        </div>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bg-glass-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-base)' }}>
                            {user.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                {user.name} {user.isYou && <span style={{ color: 'var(--primary-light)', fontSize: 'var(--text-xs)' }}>(You)</span>}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Lv.{user.level} · 🔥 {user.streak}d · ✅ {user.habitsCompleted} habits</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{user.xp.toLocaleString()} XP</div>
                        </div>
                        <span style={{ color: changeColors[user.change], fontWeight: 700, fontSize: 'var(--text-xs)', width: 16 }}>{changeIcons[user.change]}</span>
                    </div>
                ))}
            </div>
        </>
    );
}
