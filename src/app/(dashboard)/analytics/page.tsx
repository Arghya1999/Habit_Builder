'use client';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate heatmap data for the last 6 months
const generateHeatmap = () => {
    const data = [];
    const now = new Date(2026, 1, 12);
    for (let i = 180; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const level = Math.random() > 0.2 ? Math.floor(Math.random() * 4) + 1 : 0;
        data.push({ date: date.toISOString().slice(0, 10), level });
    }
    return data;
};

const heatmapData = generateHeatmap();

const weeklyData = [
    { day: 'Mon', tasks: 8, habits: 6, score: 85 },
    { day: 'Tue', tasks: 6, habits: 5, score: 72 },
    { day: 'Wed', tasks: 9, habits: 6, score: 92 },
    { day: 'Thu', tasks: 5, habits: 4, score: 65 },
    { day: 'Fri', tasks: 7, habits: 6, score: 80 },
    { day: 'Sat', tasks: 4, habits: 5, score: 70 },
    { day: 'Sun', tasks: 3, habits: 6, score: 75 },
];

const correlations = [
    { habit: 'Exercise', correlation: 'Better Mood', strength: 78, color: 'var(--success)' },
    { habit: 'Sleep by 11', correlation: 'Higher Productivity', strength: 85, color: 'var(--primary-light)' },
    { habit: 'Meditation', correlation: 'Lower Stress', strength: 72, color: 'var(--secondary)' },
    { habit: 'Reading', correlation: 'Goal Progress', strength: 65, color: 'var(--warning)' },
    { habit: 'No Sugar', correlation: 'More Energy', strength: 58, color: 'var(--accent)' },
];

const heatmapColors = ['var(--bg-glass)', 'rgba(108,92,231,0.2)', 'rgba(108,92,231,0.4)', 'rgba(108,92,231,0.6)', 'rgba(108,92,231,0.9)'];

export default function AnalyticsPage() {
    const maxBarHeight = 120;

    return (
        <>
            <div className="page-header">
                <h1>Analytics 📈</h1>
                <p>Your productivity insights, patterns, and progress over time</p>
            </div>

            {/* Summary Stats */}
            <div className="stats-grid" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--primary-light)' }}>📊</div>
                        <span className="stat-card-trend up">+5%</span>
                    </div>
                    <div className="stat-card-value">82</div>
                    <div className="stat-card-label">Avg Productivity Score</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(0,184,148,0.15)', color: 'var(--success)' }}>✅</div>
                        <span className="stat-card-trend up">+12</span>
                    </div>
                    <div className="stat-card-value">342</div>
                    <div className="stat-card-label">Tasks Completed (Month)</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253,203,110,0.15)', color: 'var(--warning)' }}>🔥</div>
                        <span className="stat-card-trend up">+3</span>
                    </div>
                    <div className="stat-card-value">12</div>
                    <div className="stat-card-label">Current Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253,121,168,0.15)', color: 'var(--accent)' }}>🎯</div>
                    </div>
                    <div className="stat-card-value">89%</div>
                    <div className="stat-card-label">Habit Consistency</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Activity Heatmap */}
                <div className="dashboard-card dashboard-card-full">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Activity Heatmap</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                            Less
                            {heatmapColors.map((c, i) => (
                                <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />
                            ))}
                            More
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                        {heatmapData.map((day, i) => (
                            <div key={i} title={`${day.date}: Level ${day.level}`} style={{
                                width: '14px', height: '14px', borderRadius: '3px',
                                background: heatmapColors[day.level],
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)',
                            }} />
                        ))}
                    </div>
                </div>

                {/* Weekly Performance Bar Chart */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Weekly Performance</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: `${maxBarHeight + 40}px`, paddingBottom: '30px' }}>
                        {weeklyData.map((day, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary-light)' }}>{day.score}</span>
                                <div style={{
                                    width: '32px', height: `${(day.score / 100) * maxBarHeight}px`,
                                    background: `linear-gradient(180deg, var(--primary), var(--primary-dark))`,
                                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                    transition: 'height var(--transition-slow)',
                                }} />
                                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Correlation Insights */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Habit-Outcome Correlations</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {correlations.map((c, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: '2px' }}>
                                        {c.habit} → {c.correlation}
                                    </div>
                                    <div className="progress-bar" style={{ height: '6px' }}>
                                        <div style={{ width: `${c.strength}%`, height: '100%', borderRadius: 'var(--radius-full)', background: c.color, transition: 'width var(--transition-slow)' }} />
                                    </div>
                                </div>
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: c.color, minWidth: '40px', textAlign: 'right' }}>{c.strength}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Best Times */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">⏰ Peak Productivity Hours</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {[
                            { time: '9:00 - 11:00 AM', label: 'Deep Work Zone', score: 95, emoji: '🔥' },
                            { time: '2:00 - 4:00 PM', label: 'Focus Block', score: 78, emoji: '💻' },
                            { time: '7:00 - 8:00 PM', label: 'Learning Time', score: 72, emoji: '📚' },
                            { time: '6:00 - 7:00 AM', label: 'Morning Routine', score: 88, emoji: '🌅' },
                        ].map((slot, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
                                <span style={{ fontSize: 'var(--text-xl)' }}>{slot.emoji}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{slot.time}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{slot.label}</div>
                                </div>
                                <span className="badge badge-primary">{slot.score}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mood Trends */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">😊 Mood Trend (Last 7 Days)</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '100px', paddingBottom: '30px' }}>
                        {[4, 3, 5, 3, 4, 5, 4].map((mood, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                <span style={{ fontSize: 'var(--text-xl)' }}>{['😢', '😕', '😐', '🙂', '😄'][mood - 1]}</span>
                                <div style={{
                                    width: '24px', height: `${mood * 14}px`,
                                    background: `linear-gradient(180deg, var(--secondary), var(--secondary-dark))`,
                                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                }} />
                                <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>{weeklyData[i]?.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
