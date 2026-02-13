'use client';
import '../auth.css';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="auth-bg-orb auth-bg-orb-1" />
                <div className="auth-bg-orb auth-bg-orb-2" />
            </div>

            <div className="auth-container animate-fade-in-up">
                <div className="auth-card">
                    <Link href="/" className="auth-logo">
                        <div className="auth-logo-icon">⚡</div>
                        <span className="auth-logo-text">RoutineForge</span>
                    </Link>

                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">Enter your email to receive a reset link</p>

                    {error && <div className="auth-error">{error}</div>}
                    {message && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '0.5rem', color: '#34d399', fontSize: '0.875rem' }}>{message}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Email</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="auth-footer">
                        Remember it? <Link href="/login">Sign in →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
