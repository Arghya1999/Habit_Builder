'use client';
import './landing.css';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: '🎯',
    iconClass: 'feature-icon-purple',
    title: 'Smart Goal Tracking',
    desc: 'Set custom-duration challenges (21, 30, 60, 90, 120 days or any number). Track daily milestones with visual progress, streaks, and calendar heatmaps.'
  },
  {
    icon: '🔥',
    iconClass: 'feature-icon-red',
    title: 'Habit Streaks & Gamification',
    desc: 'Earn XP, level up, and unlock badges. Your virtual companion grows as you build consistency. Never break the chain with streak tracking.'
  },
  {
    icon: '🤖',
    iconClass: 'feature-icon-teal',
    title: 'AI Daily Coach',
    desc: 'End-of-day AI reviews your progress, asks follow-up questions, and auto-generates journal entries. Morning planning suggests your optimal day.'
  },
  {
    icon: '✈️',
    iconClass: 'feature-icon-pink',
    title: 'Telegram Reminders',
    desc: 'Escalating reminders from gentle nudges to instant Telegram messages. Real accountability, not just notifications — 100% free.'
  },
  {
    icon: '📊',
    iconClass: 'feature-icon-yellow',
    title: 'Deep Analytics',
    desc: 'Productivity scores, habit-mood correlations, GitHub-style heatmaps, and exportable PDF reports. See patterns you never noticed.'
  },
  {
    icon: '⏰',
    iconClass: 'feature-icon-green',
    title: 'Routine Builder',
    desc: 'Design morning, afternoon, and evening routines with time blocks. Track adherence day-by-day and compare Week 1 vs Week 12 progress.'
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    desc: 'Perfect for getting started',
    highlighted: false,
    cta: 'Start Free',
    features: [
      '3 active goals',
      '5 daily habits',
      'Basic task management',
      'Simple analytics',
      'Community challenges'
    ]
  },
  {
    name: 'Pro',
    price: 9.99,
    period: '/month',
    desc: 'Everything you need to transform',
    highlighted: true,
    cta: 'Start Pro Trial',
    features: [
      'Unlimited goals & habits',
      'AI daily coach & journal',
      'Telegram reminders',
      'Mood & energy tracking',
      'Advanced analytics & reports',
      'Routine builder',
      'Template library'
    ]
  },
  {
    name: 'Premium',
    price: 19.99,
    period: '/month',
    desc: 'Maximum accountability',
    highlighted: false,
    cta: 'Go Premium',
    features: [
      'Everything in Pro',
      'Escalating Telegram reminders',
      'Financial accountability',
      'Priority support',
      'Accountability partners',
      'Shareable progress cards',
      'API access'
    ]
  },
];

const testimonials = [
  {
    name: 'Sarah K.',
    initials: 'SK',
    role: 'Software Engineer',
    text: 'The Telegram reminders changed everything. I actually completed my 90-day coding challenge for the first time. The AI daily review keeps me honest.',
    stars: 5,
  },
  {
    name: 'Raj P.',
    initials: 'RP',
    role: 'Student',
    text: 'I used to download habit apps, use them for 3 days, then forget. RoutineForge\'s Telegram accountability reminders and gamification made me stick with it for 120 days!',
    stars: 5,
  },
  {
    name: 'Emma L.',
    initials: 'EL',
    role: 'Fitness Coach',
    text: 'I recommend RoutineForge to all my clients. The routine builder and progress analytics are incredible. The AI journal feature is like having a personal coach.',
    stars: 5,
  },
];

const howItWorks = [
  {
    title: 'Set Your Goals',
    desc: 'Define what you want to achieve and for how many days. Pick from templates or create custom challenges.'
  },
  {
    title: 'Build Daily Habits & Routines',
    desc: 'Add habits to track, create time-blocked routines, and let AI suggest an optimal daily plan.'
  },
  {
    title: 'Stay Accountable',
    desc: 'Get smart reminders via app or Telegram. AI checks in daily and helps you reflect.'
  },
  {
    title: 'Track & Celebrate Progress',
    desc: 'Watch your streaks grow, earn XP and badges, see beautiful analytics, and share your wins.'
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <div className="navbar-logo-icon">⚡</div>
            RoutineForge
          </a>
          <ul className="navbar-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#testimonials">Reviews</a></li>
          </ul>
          <div className="navbar-actions">
            <a href="/login" className="btn btn-ghost">Log In</a>
            <a href="/signup" className="btn btn-primary">Start Free →</a>
          </div>
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-bg-orb hero-bg-orb-1" />
          <div className="hero-bg-orb hero-bg-orb-2" />
          <div className="hero-bg-orb hero-bg-orb-3" />
          <div className="hero-grid" />
        </div>
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="hero-badge-dot" />
            AI-Powered Accountability Partner
          </div>
          <h1 className="hero-title animate-fade-in-up delay-1">
            Build Habits That <span className="gradient-text">Actually Stick</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up delay-2">
            Set goals, track habits, build routines, and stay accountable with AI coaching,
            Telegram reminders, and smart daily reviews. Your personal transformation starts here.
          </p>
          <div className="hero-actions animate-fade-in-up delay-3">
            <a href="/signup" className="btn btn-primary btn-lg">
              Start Free — No Credit Card →
            </a>
            <a href="#features" className="btn btn-secondary btn-lg">
              See How It Works
            </a>
          </div>
          <div className="hero-stats animate-fade-in-up delay-4">
            <div className="hero-stat">
              <div className="hero-stat-value gradient-text">10K+</div>
              <div className="hero-stat-label">Active Users</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value gradient-text">2M+</div>
              <div className="hero-stat-label">Habits Tracked</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value gradient-text">94%</div>
              <div className="hero-stat-label">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">✨ Features</span>
            <h2 className="section-title">
              Everything You Need to <span className="gradient-text">Transform</span>
            </h2>
            <p className="section-subtitle">
              More than a to-do app. RoutineForge is your AI-powered accountability partner
              that actually holds you to your commitments.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <div key={i} className="feature-card">
                <div className={`feature-icon ${feature.iconClass}`}>
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">🚀 How It Works</span>
            <h2 className="section-title">
              4 Steps to a <span className="gradient-text">Better You</span>
            </h2>
            <p className="section-subtitle">
              Get started in minutes. See results in days.
            </p>
          </div>
          <div className="steps-list">
            {howItWorks.map((step, i) => (
              <div key={i} className="step-item">
                <div className="step-number">{i + 1}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">💰 Pricing</span>
            <h2 className="section-title">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="section-subtitle">
              Start free. Upgrade when you&apos;re ready for maximum accountability.
            </p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}>
                {plan.highlighted && <div className="pricing-popular">Most Popular</div>}
                <div className="pricing-name">{plan.name}</div>
                <div className="pricing-price">
                  <span className="pricing-amount">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="pricing-period">{plan.period}</span>}
                </div>
                <p className="pricing-desc">{plan.desc}</p>
                <ul className="pricing-features">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="pricing-feature">
                      <span className="pricing-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'} btn-lg`}
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-label">💬 Reviews</span>
            <h2 className="section-title">
              Loved by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="section-subtitle">
              Join 10,000+ people who transformed their habits with RoutineForge.
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {'★'.repeat(t.stars)}
                </div>
                <p className="testimonial-text">&quot;{t.text}&quot;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-card">
            <h2>Ready to Build Habits That <span className="gradient-text">Actually Stick?</span></h2>
            <p>Join 10,000+ people transforming their lives with RoutineForge. Start free today.</p>
            <a href="/signup" className="btn btn-primary btn-lg">
              Start Your Journey — Free →
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="navbar-logo">
                <div className="navbar-logo-icon">⚡</div>
                RoutineForge
              </a>
              <p>AI-powered accountability partner for building lasting habits, crushing goals, and transforming your daily routine.</p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="/changelog">Changelog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Resources</h5>
              <ul className="footer-links">
                <li><a href="/blog">Blog</a></li>
                <li><a href="/guides">Guides</a></li>
                <li><a href="/templates">Templates</a></li>
                <li><a href="/help">Help Center</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <ul className="footer-links">
                <li><a href="/about">About</a></li>
                <li><a href="/privacy">Privacy</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 RoutineForge. All rights reserved.</span>
            <span>Built with ❤️ for habit builders</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
