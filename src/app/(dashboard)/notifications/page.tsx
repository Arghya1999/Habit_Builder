'use client';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'reminder' | 'achievement' | 'streak' | 'system' | 'social';
    title: string;
    message: string;
    time: string;
    read: boolean;
    icon: string;
    actionUrl?: string;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'reminder', title: 'Task Reminder', message: 'You haven\'t completed "Complete React module - Section 5" yet. It\'s a P1 task!', time: '5 min ago', read: false, icon: '⏰', actionUrl: '/tasks' },
    { id: '2', type: 'streak', title: 'Streak at Risk! 🔥', message: 'You haven\'t logged your habits today. Complete them to keep your 12-day streak alive!', time: '1 hour ago', read: false, icon: '🔥', actionUrl: '/habits' },
    { id: '3', type: 'achievement', title: 'Badge Earned! 🏆', message: 'You earned the "Perfect Week" badge for completing all habits 7 days in a row!', time: '3 hours ago', read: false, icon: '🏆' },
    { id: '4', type: 'social', title: 'Partner Update', message: 'Sarah K. completed their daily goal. They\'re on a 15-day streak! Keep up!', time: '5 hours ago', read: true, icon: '👥' },
    { id: '5', type: 'system', title: 'Daily Review Time', message: 'It\'s 9 PM — time for your daily journal review with AI coach.', time: '6 hours ago', read: true, icon: '📝', actionUrl: '/journal' },
    { id: '6', type: 'reminder', title: 'Routine Reminder', message: 'Your "Evening Wind-Down" routine starts in 15 minutes!', time: 'Yesterday', read: true, icon: '🌙', actionUrl: '/routines' },
    { id: '7', type: 'achievement', title: 'Level Up! ⚡', message: 'Congratulations! You\'ve reached Level 5 with 2,450 XP!', time: 'Yesterday', read: true, icon: '⚡' },
    { id: '8', type: 'system', title: 'Weekly Report Ready', message: 'Your weekly analytics report is ready. Check your productivity trends!', time: '2 days ago', read: true, icon: '📊', actionUrl: '/analytics' },
];

interface ReminderSchedule {
    id: string;
    label: string;
    triggerType: string;
    time: string;
    channels: string[];
    enabled: boolean;
}

const mockSchedules: ReminderSchedule[] = [
    { id: '1', label: 'Morning Routine Start', triggerType: 'time', time: '06:00 AM', channels: ['push', 'telegram'], enabled: true },
    { id: '2', label: 'P1 Task Deadline', triggerType: 'deadline', time: '2 hours before', channels: ['push', 'telegram'], enabled: true },
    { id: '3', label: 'Habit Check-in', triggerType: 'time', time: '08:00 PM', channels: ['push'], enabled: true },
    { id: '4', label: 'Daily Journal Review', triggerType: 'time', time: '09:00 PM', channels: ['push', 'telegram'], enabled: true },
    { id: '5', label: 'Streak Protection Alert', triggerType: 'event', time: 'When streak at risk', channels: ['push', 'telegram'], enabled: true },
    { id: '6', label: 'Evening Routine Start', triggerType: 'time', time: '09:30 PM', channels: ['push'], enabled: false },
];

const typeColors: Record<string, string> = {
    reminder: 'var(--warning)',
    achievement: 'var(--accent)',
    streak: 'var(--danger)',
    system: 'var(--primary-light)',
    social: 'var(--secondary)',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [schedules, setSchedules] = useState(mockSchedules);
    const [filter, setFilter] = useState<string>('all');
    const [tab, setTab] = useState<'inbox' | 'reminders'>('inbox');

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const toggleSchedule = (id: string) => {
        setSchedules(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    };

    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Notifications 🔔</h1>
                    <p>{unreadCount} unread notifications</p>
                </div>
                <button className="btn btn-secondary" onClick={markAllRead}>Mark All Read</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
                <button className={`btn ${tab === 'inbox' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('inbox')}>
                    📥 Inbox {unreadCount > 0 && `(${unreadCount})`}
                </button>
                <button className={`btn ${tab === 'reminders' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('reminders')}>
                    ⏰ Reminder Schedules
                </button>
            </div>

            {tab === 'inbox' ? (
                <>
                    {/* Filters */}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
                        {['all', 'reminder', 'achievement', 'streak', 'social', 'system'].map(f => (
                            <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Notifications List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {filtered.map(notif => (
                            <div key={notif.id} className="dashboard-card" style={{
                                padding: 'var(--space-4)',
                                display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)',
                                opacity: notif.read ? 0.7 : 1,
                                cursor: notif.actionUrl ? 'pointer' : 'default',
                                borderLeft: `3px solid ${typeColors[notif.type]}`,
                            }}>
                                <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0 }}>{notif.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                                        <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{notif.title}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{notif.time}</span>
                                            {!notif.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }} />}
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{notif.message}</p>
                                    {notif.actionUrl && (
                                        <a href={notif.actionUrl} style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-light)', marginTop: 'var(--space-1)', display: 'inline-block' }}>
                                            View →
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <>
                    {/* Reminder Schedules */}
                    <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                        <div className="dashboard-card-header">
                            <h3 className="dashboard-card-title">Escalation Flow</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                            {[
                                { icon: '📱', label: 'Push Notification', delay: 'Immediate' },
                                { icon: '→', label: '', delay: '' },
                                { icon: '✈️', label: 'Telegram Message', delay: '+15 min' },
                            ].map((step, i) => (
                                step.icon === '→' ? (
                                    <span key={i} style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xl)' }}>→</span>
                                ) : (
                                    <div key={i} style={{
                                        padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)', textAlign: 'center', flex: 1, minWidth: '120px',
                                    }}>
                                        <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>{step.icon}</div>
                                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{step.label}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{step.delay}</div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {schedules.map(schedule => (
                            <div key={schedule.id} className="dashboard-card" style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                <button onClick={() => toggleSchedule(schedule.id)} style={{
                                    width: '48px', height: '26px', borderRadius: '13px', border: 'none',
                                    background: schedule.enabled ? 'var(--primary)' : 'var(--bg-glass-strong)',
                                    cursor: 'pointer', position: 'relative', transition: 'all var(--transition-fast)', flexShrink: 0,
                                }}>
                                    <div style={{
                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                        position: 'absolute', top: '3px',
                                        left: schedule.enabled ? '25px' : '3px',
                                        transition: 'left var(--transition-fast)',
                                    }} />
                                </button>
                                <div style={{ flex: 1, opacity: schedule.enabled ? 1 : 0.5 }}>
                                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{schedule.label}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{schedule.time}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    {schedule.channels.map(ch => (
                                        <span key={ch} style={{
                                            padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                            fontSize: '11px', fontWeight: 600,
                                            background: ch === 'telegram' ? 'rgba(0,136,204,0.15)' : 'rgba(108,92,231,0.15)',
                                            color: ch === 'telegram' ? '#0088cc' : 'var(--primary-light)',
                                        }}>
                                            {ch === 'push' ? '📱' : '✈️'} {ch}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--space-6)' }}>
                        + Add Reminder Schedule
                    </button>
                </>
            )}
        </>
    );
}
