'use client';
import '../auth.css';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!token) {
        return <div className="auth-error">Invalid or missing token</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && <div className="auth-error">{error}</div>}
            {message && <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', borderRadius: '0.5rem', color: '#34d399', fontSize: '0.875rem' }}>{message}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-field">
                    <label className="auth-label">New Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="auth-field">
                    <label className="auth-label">Confirm Password</label>
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-lg auth-submit"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </>
    );
}

export default function ResetPasswordPage() {
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

                    <h1 className="auth-title">Set New Password</h1>
                    <p className="auth-subtitle">Enter your new secure password below</p>

                    <Suspense fallback={<div>Loading form...</div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="auth-footer">
                        Remember it? <Link href="/login">Sign in →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
