'use client';
import { useState } from 'react';

export default function SettingsPage() {
    const [name, setName] = useState('User');
    const [email, setEmail] = useState('user@example.com');
    const [telegramChatId, setTelegramChatId] = useState('');
    const [reminderLevel, setReminderLevel] = useState('telegram');
    const [quietStart, setQuietStart] = useState('22:00');
    const [quietEnd, setQuietEnd] = useState('07:00');
    const [darkMode, setDarkMode] = useState(true);

    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [testingTG, setTestingTG] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [fetchingChatId, setFetchingChatId] = useState(false);

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
                    reminderLevel,
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
            setTestResult('❌ Enter your Telegram Chat ID first. Click "Find My Chat ID" to get it.');
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

    // Auto-find chat ID
    const handleFindChatId = async () => {
        setFetchingChatId(true);
        setTestResult(null);
        try {
            const res = await fetch('/api/reminders/bot');
            const data = await res.json();
            if (data.success && data.recentChats?.length > 0) {
                const chat = data.recentChats[0];
                setTelegramChatId(String(chat.chatId));
                setTestResult(`✅ Found your Chat ID: ${chat.chatId} (${chat.firstName || chat.username || 'User'}). It has been auto-filled!`);
            } else if (data.success && data.bot) {
                const botUsername = (data.bot as Record<string, unknown>).username as string;
                setTestResult(`⚠️ Bot found (@${botUsername}) but no chats yet. Send /start to @${botUsername} on Telegram, then click "Find My Chat ID" again.`);
            } else {
                setTestResult(`❌ ${data.error || 'Could not find bot info. Check your TELEGRAM_BOT_TOKEN in .env'}`);
            }
        } catch {
            setTestResult('❌ Network error — could not reach server.');
        } finally {
            setFetchingChatId(false);
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
                            <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* Telegram & Reminders */}
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>🔔 Notification & Reminders</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                        {/* Telegram Setup Info */}
                        <div style={{
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'rgba(0, 136, 204, 0.08)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(0, 136, 204, 0.15)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                                <span style={{ fontSize: 'var(--text-base)' }}>✈️</span>
                                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: '#0088cc' }}>Telegram Reminders (100% Free)</span>
                            </div>
                            <ol style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <li>Search for your RoutineForge bot on Telegram</li>
                                <li>Send <strong>/start</strong> to the bot</li>
                                <li>Click &quot;Find My Chat ID&quot; below to auto-fill your ID</li>
                            </ol>
                        </div>

                        {/* Telegram Chat ID */}
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Telegram Chat ID</label>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <input
                                    className="input"
                                    value={telegramChatId}
                                    onChange={e => setTelegramChatId(e.target.value)}
                                    placeholder="e.g. 123456789"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    className="btn btn-sm"
                                    style={{ background: 'rgba(0,136,204,0.15)', color: '#0088cc', border: '1px solid rgba(0,136,204,0.25)', whiteSpace: 'nowrap' }}
                                    onClick={handleFindChatId}
                                    disabled={fetchingChatId}
                                >
                                    {fetchingChatId ? '⏳ Searching...' : '🔍 Find My Chat ID'}
                                </button>
                            </div>
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
                            {reminderLevel === 'escalating' && (
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-2)' }}>
                                    ℹ️ Escalating: Push → Telegram message if task remains incomplete
                                </p>
                            )}
                        </div>

                        {/* Test Button */}
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

                {/* Appearance */}
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>🎨 Appearance</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Dark Mode</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Use dark theme across the app</div>
                        </div>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            style={{
                                width: '48px', height: '26px', borderRadius: '13px', border: 'none',
                                background: darkMode ? 'var(--primary)' : 'var(--bg-glass-strong)',
                                cursor: 'pointer', position: 'relative', transition: 'all var(--transition-fast)',
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                position: 'absolute', top: '3px',
                                left: darkMode ? '25px' : '3px',
                                transition: 'left var(--transition-fast)',
                            }} />
                        </button>
                    </div>
                </div>

                {/* Subscription */}
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>💎 Subscription</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Current Plan: <span style={{ color: 'var(--primary-light)' }}>Free</span></div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Upgrade to unlock AI coaching, Telegram reminders, and more</div>
                        </div>
                        <button className="btn btn-primary">Upgrade to Pro</button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="dashboard-card" style={{ borderColor: 'rgba(255, 107, 107, 0.2)' }}>
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)', color: 'var(--danger)' }}>⚠️ Danger Zone</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Delete Account</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Permanently delete your account and all data</div>
                        </div>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--danger)', border: '1px solid rgba(255,107,107,0.2)' }}>
                            Delete Account
                        </button>
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
