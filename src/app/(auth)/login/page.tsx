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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        // We use the server action for login
        // Since it redirects on success, we only handle errors here if it returns
        import('@/app/actions/auth').then(async ({ loginWithCredentials }) => {
            const result = await loginWithCredentials(formData);
            if (result) {
                setError(result);
                setLoading(false);
            }
        });
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



                    <div className="auth-footer">
                        Don&apos;t have an account? <Link href="/signup">Sign up free →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
