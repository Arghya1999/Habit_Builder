'use client';
import '../auth.css';
import { useState } from 'react';
import Link from 'next/link';
import { loginWithGoogle } from '@/app/actions/auth';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');
        // Simulate login — redirect to dashboard
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
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

                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue building better habits</p>

                    {error && <div className="auth-error">{error}</div>}

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

                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <div className="auth-password-wrapper">
                                <input
                                    className="auth-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                            <div className="auth-forgot">
                                <a href="/forgot-password">Forgot password?</a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <div className="auth-divider">or continue with</div>

                    <div className="auth-social-grid">
                        <form action={loginWithGoogle}>
                            <button className="auth-social-btn" type="submit">
                                <span>🔵</span> Google
                            </button>
                        </form>
                        <button className="auth-social-btn">
                            <span>⚫</span> GitHub
                        </button>
                    </div>

                    <div className="auth-footer">
                        Don&apos;t have an account? <Link href="/signup">Sign up free →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
