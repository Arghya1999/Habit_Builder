'use client';
import { useState } from 'react';

interface SettingsClientProps {
    initialUser: {
        id: string;
        name: string;
        email: string;
        telegramChatId: string | null;
        reminderLevel: string;
        quietStart: string | null;
        quietEnd: string | null;
        darkMode: boolean;
    };
    botUsername: string;
}

export default function SettingsClient({ initialUser, botUsername }: SettingsClientProps) {
    const [name, setName] = useState(initialUser.name);
    const [email, setEmail] = useState(initialUser.email);
    const [telegramChatId, setTelegramChatId] = useState(initialUser.telegramChatId || '');
    const [reminderLevel, setReminderLevel] = useState(initialUser.reminderLevel.toLowerCase());
    const [quietStart, setQuietStart] = useState(initialUser.quietStart || '22:00');
    const [quietEnd, setQuietEnd] = useState(initialUser.quietEnd || '07:00');
    const [darkMode, setDarkMode] = useState(initialUser.darkMode);

    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testingTG, setTestingTG] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);

    // Save settings to backend
    const handleSave = async () => {
        setSaving(true);
        setSaveStatus('idle');
        try {
            const res = await fetch('/api/user/settings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'current',
                    name,
                    telegramChatId,
                    reminderLevel: reminderLevel.toUpperCase(),
                    quietStart,
                    quietEnd,
                    darkMode,
                }),
            });
            if (res.ok) {
                setSaveStatus('success');
                setTimeout(() => setSaveStatus('idle'), 3000);
            } else {
                setSaveStatus('error');
            }
        } catch {
            setSaveStatus('error');
        } finally {
            setSaving(false);
        }
    };

    // Test Telegram message
    const handleTestTelegram = async () => {
        if (!telegramChatId) {
            setTestResult('❌ Connect Telegram first.');
            return;
        }
        setTestingTG(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/reminders/telegram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: telegramChatId,
                    message: '✅ <b>Test message from RoutineForge!</b>\n\nYour Telegram reminders are working. 🎉',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setTestResult('✅ Telegram message sent! Check your Telegram app.');
            } else {
                setTestResult(`❌ Failed: ${data.error}`);
            }
        } catch {
            setTestResult('❌ Network error — could not reach server.');
        } finally {
            setTestingTG(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h1>Settings ⚙️</h1>
                <p>Manage your account, reminders, and preferences</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '700px' }}>
                {/* Profile */}
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>👤 Profile</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Name</label>
                            <input className="input" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Email</label>
                            <input className="input" value={email} onChange={e => setEmail(e.target.value)} disabled />
                        </div>
                    </div>
                </div>

                {/* Telegram & Reminders */}
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>🔔 Notification & Reminders</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                        {/* Telegram Connect */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Telegram Connection</label>
                            {telegramChatId ? (
                                <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', background: 'var(--bg-glass)', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)' }}>
                                    <span style={{ fontSize: 'var(--text-xl)' }}>✅</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600 }}>Connected</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Chat ID: {telegramChatId}</div>
                                    </div>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setTelegramChatId('')}
                                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    <a
                                        href={`https://t.me/${botUsername}?start=${initialUser.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#0088cc' }}
                                    >
                                        <span>✈️</span> Connect Telegram Bot
                                    </a>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                                        Clicking this will open Telegram. Click <strong>Start</strong> to link your account instantly.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Hidden Input for manual override if needed */}
                        <div style={{ display: telegramChatId ? 'none' : 'block', marginTop: 'var(--space-2)' }}>
                            <details>
                                <summary style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', cursor: 'pointer' }}>Advanced: Enter Chat ID manually</summary>
                                <input
                                    className="input"
                                    value={telegramChatId}
                                    onChange={e => setTelegramChatId(e.target.value)}
                                    placeholder="Telegram Chat ID"
                                    style={{ marginTop: 'var(--space-2)' }}
                                />
                            </details>
                        </div>


                        {/* Reminder Level */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Reminder Level</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                {[
                                    { value: 'push', label: '📱 Push Only' },
                                    { value: 'telegram', label: '✈️ Telegram' },
                                    { value: 'escalating', label: '🚨 Escalating' },
                                ].map(opt => (
                                    <button key={opt.value}
                                        className={`btn btn-sm ${reminderLevel === opt.value ? 'btn-primary' : 'btn-secondary'}`}
                                        onClick={() => setReminderLevel(opt.value)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Test Button */}
                        {telegramChatId && (
                            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-sm"
                                    style={{ background: 'rgba(0,136,204,0.15)', color: '#0088cc', border: '1px solid rgba(0,136,204,0.25)' }}
                                    onClick={handleTestTelegram}
                                    disabled={testingTG}
                                >
                                    {testingTG ? '⏳ Sending...' : '✈️ Send Test Telegram Message'}
                                </button>
                            </div>
                        )}

                        {/* Test Result */}
                        {testResult && (
                            <div style={{
                                padding: 'var(--space-3) var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: 'var(--text-sm)',
                                background: testResult.startsWith('✅') ? 'rgba(0,184,148,0.08)' : testResult.startsWith('⚠️') ? 'rgba(253,203,110,0.08)' : 'rgba(255,107,107,0.08)',
                                border: `1px solid ${testResult.startsWith('✅') ? 'rgba(0,184,148,0.2)' : testResult.startsWith('⚠️') ? 'rgba(253,203,110,0.2)' : 'rgba(255,107,107,0.2)'}`,
                                color: testResult.startsWith('✅') ? 'var(--success)' : testResult.startsWith('⚠️') ? '#e67e22' : 'var(--danger)',
                            }}>
                                {testResult}
                            </div>
                        )}

                        {/* Quiet Hours */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Quiet Hours Start</label>
                                <input className="input" type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} />
                            </div>
                            <div>
                                <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Quiet Hours End</label>
                                <input className="input" type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save */}
                <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? '⏳ Saving...' : saveStatus === 'success' ? '✅ Saved Successfully!' : saveStatus === 'error' ? '❌ Error — Try Again' : 'Save Changes'}
                </button>
            </div>
        </>
    );
}
