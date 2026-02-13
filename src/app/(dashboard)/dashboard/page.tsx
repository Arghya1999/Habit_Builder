'use client';
import { useState } from 'react';

const mockTasks = [
    { id: '1', title: 'Complete React module - Section 5', priority: 'P1', completed: false },
    { id: '2', title: 'Morning meditation - 15 minutes', priority: 'P2', completed: true },
    { id: '3', title: 'Read 20 pages of Atomic Habits', priority: 'P2', completed: false },
    { id: '4', title: 'Review flashcards for Spanish', priority: 'P3', completed: false },
    { id: '5', title: 'Write blog post draft', priority: 'P3', completed: false },
];

const mockHabits = [
    { id: '1', name: 'Exercise', icon: '💪', streak: 12, done: true },
    { id: '2', name: 'Reading', icon: '📚', streak: 8, done: false },
    { id: '3', name: 'Meditation', icon: '🧘', streak: 15, done: true },
    { id: '4', name: 'Journaling', icon: '✍️', streak: 5, done: false },
    { id: '5', name: 'No Sugar', icon: '🍎', streak: 3, done: true },
    { id: '6', name: 'Sleep by 11', icon: '😴', streak: 7, done: false },
];

const mockGoals = [
    { id: '1', title: 'Learn React in 60 Days', progress: 68, daysLeft: 19, category: '💻' },
    { id: '2', title: '90-Day Fitness Challenge', progress: 42, daysLeft: 52, category: '🏋️' },
    { id: '3', title: 'Read 30 Books This Year', progress: 23, daysLeft: 320, category: '📖' },
];

const mockActivity = [
    { text: 'Completed "Morning Exercise" habit', time: '2 min ago', type: 'success' },
    { text: 'Added new task: Review flashcards', time: '15 min ago', type: 'primary' },
    { text: 'Reached Level 5! Earned "Consistent" badge', time: '1 hour ago', type: 'warning' },
    { text: 'Completed 3/5 daily tasks', time: '2 hours ago', type: 'primary' },
    { text: 'Journal entry saved for yesterday', time: '5 hours ago', type: 'success' },
];

export default function DashboardPage() {
    const [tasks, setTasks] = useState(mockTasks);
    const [habits, setHabits] = useState(mockHabits);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const toggleHabit = (id: string) => {
        setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
    };

    const completedTasks = tasks.filter(t => t.completed).length;
    const completedHabits = habits.filter(h => h.done).length;

    return (
        <>
            <div className="page-header">
                <h1>Good Morning! 👋</h1>
                <p>Here&apos;s your progress overview for today. Keep pushing!</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: 'var(--primary-light)' }}>📊</div>
                        <span className="stat-card-trend up">+12%</span>
                    </div>
                    <div className="stat-card-value">87</div>
                    <div className="stat-card-label">Productivity Score</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(0, 184, 148, 0.15)', color: 'var(--success)' }}>✅</div>
                        <span className="stat-card-trend up">+3</span>
                    </div>
                    <div className="stat-card-value">{completedTasks}/{tasks.length}</div>
                    <div className="stat-card-label">Tasks Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253, 203, 110, 0.15)', color: 'var(--warning)' }}>🔥</div>
                        <span className="stat-card-trend up">+1</span>
                    </div>
                    <div className="stat-card-value">12</div>
                    <div className="stat-card-label">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253, 121, 168, 0.15)', color: 'var(--accent)' }}>⚡</div>
                        <span className="stat-card-trend up">+150</span>
                    </div>
                    <div className="stat-card-value">2,450</div>
                    <div className="stat-card-label">Total XP</div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
                {/* Today's Tasks */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Today&apos;s Tasks</h3>
                        <button className="btn btn-sm btn-secondary">+ Add Task</button>
                    </div>
                    <div className="task-list">
                        {tasks.map(task => (
                            <div key={task.id} className="task-item">
                                <button
                                    className={`task-check ${task.completed ? 'completed' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.completed ? '✓' : ''}
                                </button>
                                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                                    {task.title}
                                </span>
                                <span className={`task-priority ${task.priority.toLowerCase()}`}>
                                    {task.priority}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Habits */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Today&apos;s Habits ({completedHabits}/{habits.length})</h3>
                        <button className="btn btn-sm btn-secondary">+ Add Habit</button>
                    </div>
                    <div className="habits-grid">
                        {habits.map(habit => (
                            <div key={habit.id} className={`habit-item ${habit.done ? 'done' : ''}`}>
                                <span className="habit-icon">{habit.icon}</span>
                                <div className="habit-info">
                                    <div className="habit-name">{habit.name}</div>
                                    <div className="habit-streak">🔥 {habit.streak} days</div>
                                </div>
                                <button
                                    className={`habit-check-btn ${habit.done ? 'done' : ''}`}
                                    onClick={() => toggleHabit(habit.id)}
                                >
                                    {habit.done ? '✓' : ''}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Goals */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Active Goals</h3>
                        <button className="btn btn-sm btn-secondary">View All</button>
                    </div>
                    <div className="goals-list">
                        {mockGoals.map(goal => (
                            <div key={goal.id} className="goal-item">
                                <div className="goal-item-header">
                                    <span className="goal-item-title">{goal.category} {goal.title}</span>
                                    <span className="goal-item-pct">{goal.progress}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-bar-fill" style={{ width: `${goal.progress}%` }} />
                                </div>
                                <div className="goal-item-meta">{goal.daysLeft} days remaining</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                        {mockActivity.map((item, i) => (
                            <div key={i} className="activity-item">
                                <div className={`activity-dot ${item.type}`} />
                                <div>
                                    <div className="activity-text">{item.text}</div>
                                    <div className="activity-time">{item.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
