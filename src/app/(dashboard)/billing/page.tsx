'use client';
import { useState } from 'react';

interface PlanFeature {
    name: string;
    free: boolean | string;
    pro: boolean | string;
    premium: boolean | string;
}

const features: PlanFeature[] = [
    { name: 'Habits tracking', free: '5 habits', pro: 'Unlimited', premium: 'Unlimited' },
    { name: 'Goals & challenges', free: '2 active', pro: 'Unlimited', premium: 'Unlimited' },
    { name: 'Task management', free: true, pro: true, premium: true },
    { name: 'Daily routines', free: '1 routine', pro: 'Unlimited', premium: 'Unlimited' },
    { name: 'Basic analytics', free: true, pro: true, premium: true },
    { name: 'AI Journal coach', free: false, pro: true, premium: true },
    { name: 'Advanced analytics', free: false, pro: true, premium: true },
    { name: 'Telegram reminders', free: false, pro: true, premium: true },
    { name: 'Accountability partners', free: false, pro: '3 partners', premium: 'Unlimited' },
    { name: 'Community challenges', free: false, pro: true, premium: true },
    { name: 'Escalating Telegram reminders', free: false, pro: false, premium: true },
    { name: 'Smart escalation system', free: false, pro: false, premium: true },
    { name: 'Custom templates', free: false, pro: false, premium: true },
    { name: 'Priority support', free: false, pro: false, premium: true },
    { name: 'Team/Family plan', free: false, pro: false, premium: true },
];

const plans = [
    {
        id: 'free',
        name: 'Free',
        priceUSD: 0, yearlyPriceUSD: 0,
        priceINR: 0, yearlyPriceINR: 0,
        description: 'Get started with basic habit tracking',
        icon: '🌱',
        popular: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        priceUSD: 2, yearlyPriceUSD: 1,
        priceINR: 49, yearlyPriceINR: 29,
        description: 'Unlock AI coaching and advanced features',
        icon: '⚡',
        popular: true,
    },
    {
        id: 'premium',
        name: 'Premium',
        priceUSD: 5, yearlyPriceUSD: 3,
        priceINR: 149, yearlyPriceINR: 99,
        description: 'Full power with escalating reminders and teams',
        icon: '👑',
        popular: false,
    },
];

const paymentMethods = [
    { icon: '🏦', name: 'UPI', description: 'Google Pay, PhonePe, Paytm, BHIM', region: 'IN' },
    { icon: '💳', name: 'Cards', description: 'Visa, Mastercard, RuPay, Amex', region: 'ALL' },
    { icon: '🏧', name: 'Net Banking', description: 'All major Indian banks', region: 'IN' },
    { icon: '👛', name: 'Wallets', description: 'Paytm, Mobikwik, Freecharge', region: 'IN' },
    { icon: '📱', name: 'EMI', description: 'No-cost EMI on yearly plans', region: 'IN' },
    { icon: '🌐', name: 'International', description: 'Stripe (USD) for global payments', region: 'INTL' },
];

type Currency = 'INR' | 'USD';

export default function BillingPage() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
    const [currency, setCurrency] = useState<Currency>('INR');
    const [currentPlan] = useState('free');

    const getPrice = (plan: typeof plans[0]) => {
        if (currency === 'INR') {
            return billing === 'monthly' ? plan.priceINR : plan.yearlyPriceINR;
        }
        return billing === 'monthly' ? plan.priceUSD : plan.yearlyPriceUSD;
    };

    const currencySymbol = currency === 'INR' ? '₹' : '$';

    return (
        <>
            <div className="page-header">
                <h1>Billing & Plans 💳</h1>
                <p>Manage your subscription and unlock premium features</p>
            </div>

            {/* Current Plan */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>Current Plan</div>
                    <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                        🌱 Free Plan
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>5 habits · 2 active goals · Basic analytics</div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <div style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary-light)' }}>3/5</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Habits Used</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: 'var(--space-2) var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--primary-light)' }}>2/2</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Goals Used</div>
                    </div>
                </div>
            </div>

            {/* Currency & Billing Toggles */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                {/* Currency Toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-glass-strong)', borderRadius: 'var(--radius-full)', padding: 3 }}>
                    {(['INR', 'USD'] as const).map(c => (
                        <button key={c} onClick={() => setCurrency(c)} style={{
                            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: 'none',
                            background: currency === c ? 'var(--secondary)' : 'transparent',
                            color: currency === c ? 'white' : 'var(--text-secondary)',
                            fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                            transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
                        }}>
                            {c === 'INR' ? '🇮🇳 INR' : '🌐 USD'}
                        </button>
                    ))}
                </div>

                {/* Billing Toggle */}
                <div style={{ display: 'flex', background: 'var(--bg-glass-strong)', borderRadius: 'var(--radius-full)', padding: 3 }}>
                    <button onClick={() => setBilling('monthly')} style={{
                        padding: 'var(--space-2) var(--space-5)', borderRadius: 'var(--radius-full)', border: 'none',
                        background: billing === 'monthly' ? 'var(--primary)' : 'transparent',
                        color: billing === 'monthly' ? 'white' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                        transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
                    }}>Monthly</button>
                    <button onClick={() => setBilling('yearly')} style={{
                        padding: 'var(--space-2) var(--space-5)', borderRadius: 'var(--radius-full)', border: 'none',
                        background: billing === 'yearly' ? 'var(--primary)' : 'transparent',
                        color: billing === 'yearly' ? 'white' : 'var(--text-secondary)',
                        fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                        transition: 'all var(--transition-fast)', fontFamily: 'var(--font-sans)',
                    }}>Yearly <span style={{ fontSize: '11px', color: billing === 'yearly' ? 'rgba(255,255,255,0.7)' : 'var(--success)', fontWeight: 700 }}>Save 17%</span></button>
                </div>
            </div>

            {/* Plan Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
                {plans.map(plan => {
                    const price = getPrice(plan);
                    const isCurrent = currentPlan === plan.id;
                    const yearlyTotal = currency === 'INR' ? plan.yearlyPriceINR * 12 : plan.yearlyPriceUSD * 12;
                    return (
                        <div key={plan.id} className="dashboard-card" style={{
                            padding: 'var(--space-6)',
                            border: plan.popular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                            position: 'relative', overflow: 'visible',
                        }}>
                            {plan.popular && (
                                <div style={{
                                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                    background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                                    padding: '4px 16px', borderRadius: 'var(--radius-full)',
                                    fontSize: '11px', fontWeight: 700, color: 'white', whiteSpace: 'nowrap',
                                }}>Most Popular</div>
                            )}

                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                                <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)' }}>{plan.icon}</div>
                                <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{plan.name}</h3>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{plan.description}</p>
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
                                <span style={{ fontSize: 'var(--text-4xl)', fontWeight: 800 }}>
                                    {currencySymbol}{price}
                                </span>
                                {price > 0 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>/mo</span>}
                                {billing === 'yearly' && price > 0 && (
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', marginTop: 2 }}>
                                        Billed {currencySymbol}{yearlyTotal}/year
                                    </div>
                                )}
                                {currency === 'INR' && price > 0 && (
                                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: 2 }}>
                                        ≈ {currencySymbol}{Math.round(price / 30)}/day
                                    </div>
                                )}
                            </div>

                            <button
                                className={`btn ${isCurrent ? 'btn-secondary' : plan.popular ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                                style={{ width: '100%', marginBottom: 'var(--space-4)' }}
                                disabled={isCurrent}
                            >
                                {isCurrent ? 'Current Plan' : price === 0 ? 'Get Started' : 'Upgrade Now'}
                            </button>

                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {features.slice(0, 8).map((feat, i) => {
                                    const val = feat[plan.id as keyof PlanFeature];
                                    const available = val !== false;
                                    return (
                                        <li key={i} style={{
                                            fontSize: 'var(--text-xs)', color: available ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', opacity: available ? 1 : 0.4,
                                        }}>
                                            <span>{available ? '✓' : '✗'}</span>
                                            <span>{feat.name}{typeof val === 'string' ? ` (${val})` : ''}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* Accepted Payment Methods */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>Accepted Payment Methods</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
                    {paymentMethods
                        .filter(m => currency === 'INR' ? m.region !== 'INTL' : m.region !== 'IN')
                        .map((method, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-glass)',
                                borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)',
                            }}>
                                <span style={{ fontSize: 'var(--text-xl)' }}>{method.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{method.name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{method.description}</div>
                                </div>
                            </div>
                        ))}
                </div>
                {currency === 'INR' && (
                    <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(0, 184, 148, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(0, 184, 148, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>🇮🇳</span>
                            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--success)' }}>Powered by Razorpay</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                            RBI-compliant payments. Supports UPI, cards, net banking, wallets, and EMI. Your data stays in India. GST invoice generated automatically.
                        </p>
                    </div>
                )}
                {currency === 'USD' && (
                    <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'rgba(108, 92, 231, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(108, 92, 231, 0.15)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <span style={{ fontSize: 'var(--text-base)' }}>🌐</span>
                            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--primary-light)' }}>Powered by Stripe</span>
                        </div>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                            Secure, PCI-compliant payments. Supports Visa, Mastercard, Amex, and 135+ currencies. Cancel anytime.
                        </p>
                    </div>
                )}
            </div>

            {/* Feature Comparison */}
            <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-6)' }}>
                <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>Feature Comparison</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: 'var(--space-3) var(--space-5)', textAlign: 'left', fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-color)' }}>Feature</th>
                                {plans.map(p => (
                                    <th key={p.id} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)' }}>
                                        {p.icon} {p.name}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feat, i) => (
                                <tr key={i} style={{ borderBottom: i < features.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                    <td style={{ padding: 'var(--space-3) var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{feat.name}</td>
                                    {(['free', 'pro', 'premium'] as const).map(planId => {
                                        const val = feat[planId];
                                        return (
                                            <td key={planId} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', fontSize: 'var(--text-sm)' }}>
                                                {val === true ? <span style={{ color: 'var(--success)' }}>✓</span> :
                                                    val === false ? <span style={{ color: 'var(--text-tertiary)', opacity: 0.4 }}>—</span> :
                                                        <span style={{ color: 'var(--primary-light)', fontSize: 'var(--text-xs)' }}>{val}</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Saved Payment Methods */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>Saved Payment Methods</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <span style={{ fontSize: 'var(--text-xl)' }}>💳</span>
                            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>No payment method on file</span>
                        </div>
                        <button className="btn btn-secondary btn-sm">Add Card</button>
                    </div>
                    {currency === 'INR' && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-glass)', borderRadius: 'var(--radius-lg)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                <span style={{ fontSize: 'var(--text-xl)' }}>🏦</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>No UPI ID linked</span>
                            </div>
                            <button className="btn btn-secondary btn-sm">Link UPI</button>
                        </div>
                    )}
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-3)' }}>
                    {currency === 'INR'
                        ? '🔒 Secured by Razorpay. RBI-compliant. GST invoice auto-generated. Cancel anytime.'
                        : '🔒 Powered by Stripe. PCI DSS Level 1 compliant. Cancel anytime.'
                    }
                </p>
            </div>

            {/* GST Info (India only) */}
            {currency === 'INR' && (
                <div className="dashboard-card">
                    <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>GST & Tax Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>GSTIN (Optional)</label>
                            <input className="input" placeholder="e.g. 27AAPFU0939F1ZV" />
                        </div>
                        <div>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Business Name</label>
                            <input className="input" placeholder="Your business name" />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 'var(--space-2)' }}>Billing Address</label>
                            <input className="input" placeholder="Full address for GST invoice" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <button className="btn btn-secondary">Save Tax Details</button>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 'var(--space-3)' }}>
                        18% GST applies to all plans. GST invoice will be emailed after each payment. Input GSTIN to claim GST credit.
                    </p>
                </div>
            )}
        </>
    );
}
