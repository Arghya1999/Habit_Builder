'use client';
import './dashboard.css';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
    {
        section: 'Main', items: [
            { href: '/dashboard', icon: '📊', label: 'Dashboard' },
            { href: '/dashboard/goals', icon: '🎯', label: 'Goals', badge: '3' },
            { href: '/dashboard/tasks', icon: '✅', label: 'Tasks', badge: '5' },
        ]
    },
    {
        section: 'Tracking', items: [
            { href: '/dashboard/habits', icon: '🔥', label: 'Habits' },
            { href: '/dashboard/routines', icon: '⏰', label: 'Routines' },
            { href: '/dashboard/journal', icon: '📝', label: 'Journal' },
        ]
    },
    {
        section: 'Social', items: [
            { href: '/dashboard/community', icon: '👥', label: 'Community' },
            { href: '/dashboard/leaderboard', icon: '🏆', label: 'Leaderboard' },
        ]
    },
    {
        section: 'More', items: [
            { href: '/dashboard/analytics', icon: '📈', label: 'Analytics' },
            { href: '/dashboard/notifications', icon: '🔔', label: 'Notifications', badge: '3' },
            { href: '/dashboard/billing', icon: '💳', label: 'Billing' },
            { href: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
        ]
    },
];

interface DashboardLayoutProps {
    children: React.ReactNode;
    userData: {
        name: string;
        email: string;
        image?: string;
        level: number;
        xp: number;
        streak: number;
        xpProgress: number;
    };
}

export default function DashboardLayout({
    children,
    userData
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const currentPage = navItems
        .flatMap(s => s.items)
        .find(item => pathname === item.href)?.label || 'Dashboard';

    return (
        <div className="dashboard-layout">
            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" className="sidebar-logo">
                        <div className="sidebar-logo-icon">⚡</div>
                        <span className="sidebar-logo-text">RoutineForge</span>
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((section, si) => (
                        <div key={si} className="sidebar-section">
                            <div className="sidebar-section-label">{section.section}</div>
                            {section.items.map((item, ii) => (
                                <Link
                                    key={ii}
                                    href={item.href}
                                    className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    {item.label}
                                    {item.badge && (
                                        <span className="sidebar-link-badge">{item.badge}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-user">
                    <div className="sidebar-avatar">
                        {userData.image ? (
                            <img src={userData.image} alt={userData.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        ) : (
                            userData.name.charAt(0).toUpperCase()
                        )}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{userData.name}</div>
                        <div className="sidebar-user-level">Level {userData.level} · {userData.xp} XP</div>
                        <div className="sidebar-xp-bar">
                            <div className="sidebar-xp-fill" style={{ width: `${userData.xpProgress}%` }} />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="topbar">
                    <div className="topbar-left">
                        <button
                            className="topbar-mobile-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            ☰
                        </button>
                        <h2 className="topbar-title">{currentPage}</h2>
                    </div>
                    <div className="topbar-right">
                        <div className="topbar-streak">🔥 {userData.streak} day streak</div>
                        <div className="topbar-xp">⚡ {userData.xp} XP</div>
                        <button className="topbar-notif">
                            🔔
                            <span className="topbar-notif-dot" />
                        </button>
                    </div>
                </div>
                <div className="dashboard-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
