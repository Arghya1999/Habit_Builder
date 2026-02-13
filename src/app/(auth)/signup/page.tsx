'use client';
import '../auth.css';
import { useState, useMemo } from 'react';
import Link from 'next/link';

function getPasswordStrength(password: string): { score: number; label: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: 'Weak' };
    if (score <= 2) return { score, label: 'Medium' };
    if (score <= 3) return { score, label: 'Good' };
    return { score, label: 'Strong' };
}

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [agreed, setAgreed] = useState(false);

    const strength = useMemo(() => getPasswordStrength(password), [password]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        if (!agreed) {
            setError('Please agree to the Terms of Service');
            return;
        }
        setLoading(true);
        setError('');
        // Simulate signup
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    };

    const strengthBarClass = (index: number) => {
        if (index < strength.score) {
            if (strength.score <= 1) return 'active-weak';
            if (strength.score <= 2) return 'active-medium';
            return 'active-strong';
        }
        return '';
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

                    <h1 className="auth-title">Start Your Journey</h1>
                    <p className="auth-subtitle">Create your free account and transform your habits</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label className="auth-label">Full Name</label>
                            <input
                                className="auth-input"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>

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
                                    placeholder="Min 8 characters"
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
                            {password && (
                                <>
                                    <div className="auth-strength">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className={`auth-strength-bar ${strengthBarClass(i)}`} />
                                        ))}
                                    </div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                        Password strength: {strength.label}
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={e => setAgreed(e.target.checked)}
                                style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
                            />
                            <label htmlFor="terms" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                                I agree to the <a href="/terms" style={{ color: 'var(--primary-light)' }}>Terms of Service</a> and <a href="/privacy" style={{ color: 'var(--primary-light)' }}>Privacy Policy</a>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg auth-submit"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Creating account...' : 'Create Free Account →'}
                        </button>
                    </form>

                    <div className="auth-divider">or continue with</div>

                    <div className="auth-social-grid">
                        <button className="auth-social-btn">
                            <span>🔵</span> Google
                        </button>
                        <button className="auth-social-btn">
                            <span>⚫</span> GitHub
                        </button>
                    </div>

                    <div className="auth-footer">
                        Already have an account? <Link href="/login">Sign in →</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
