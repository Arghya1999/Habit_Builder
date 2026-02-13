'use client';
import { useState } from 'react';
import { toggleTask, toggleHabit, createTask, createHabit } from '@/app/actions/dashboard';

interface Task {
    id: string;
    title: string;
    priority: string;
    completed: boolean;
}

interface Habit {
    id: string;
    name: string;
    icon: string;
    streak: number;
    done: boolean;
    totalDone: number;
}

interface DashboardClientProps {
    initialTasks: Task[];
    initialHabits: Habit[];
    xp: number;
    streak: number;
    level: number;
}

export default function DashboardClient({
    initialTasks,
    initialHabits,
    xp,
    streak,
    level,
}: DashboardClientProps) {
    const [tasks, setTasks] = useState(initialTasks);
    const [habits, setHabits] = useState(initialHabits);

    const handleToggleTask = async (id: string, currentCompleted: boolean) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
        await toggleTask(id, !currentCompleted);
    };

    const handleToggleHabit = async (id: string, currentDone: boolean) => {
        // Optimistic update
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const newDone = !h.done;
                return {
                    ...h,
                    done: newDone,
                    streak: newDone ? h.streak + 1 : Math.max(0, h.streak - 1)
                };
            }
            return h;
        }));
        await toggleHabit(id);
    };

    const handleCreateTask = async () => {
        const title = prompt("Enter task title:");
        if (title) {
            await createTask(title);
            // Revalidation will update the list
        }
    };

    const handleCreateHabit = async () => {
        const name = prompt("Enter habit name:");
        if (name) {
            await createHabit(name);
        }
    };

    const completedTasksCount = tasks.filter(t => t.completed).length;
    const completedHabitsCount = habits.filter(h => h.done).length;

    return (
        <>
            <div className="page-header">
                <h1>Dashboard ⚡</h1>
                <p>Welcome back! Here&apos;s your progress overview for today.</p>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(108, 92, 231, 0.15)', color: 'var(--primary-light)' }}>📊</div>
                    </div>
                    <div className="stat-card-value">{level}</div>
                    <div className="stat-card-label">Current Level</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(0, 184, 148, 0.15)', color: 'var(--success)' }}>✅</div>
                    </div>
                    <div className="stat-card-value">{completedTasksCount}/{tasks.length}</div>
                    <div className="stat-card-label">Tasks Completed</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253, 203, 110, 0.15)', color: 'var(--warning)' }}>🔥</div>
                    </div>
                    <div className="stat-card-value">{streak}</div>
                    <div className="stat-card-label">Day Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-header">
                        <div className="stat-card-icon" style={{ background: 'rgba(253, 121, 168, 0.15)', color: 'var(--accent)' }}>⚡</div>
                    </div>
                    <div className="stat-card-value">{xp}</div>
                    <div className="stat-card-label">Total XP</div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="dashboard-grid">
                {/* Today's Tasks */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Today&apos;s Tasks</h3>
                        <button className="btn btn-sm btn-secondary" onClick={handleCreateTask}>+ Add Task</button>
                    </div>
                    <div className="task-list">
                        {tasks.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                No tasks for today.
                            </div>
                        ) : (
                            tasks.map(task => (
                                <div key={task.id} className="task-item">
                                    <button
                                        className={`task-check ${task.completed ? 'completed' : ''}`}
                                        onClick={() => handleToggleTask(task.id, task.completed)}
                                    >
                                        {task.completed ? '✓' : ''}
                                    </button>
                                    <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                                        {task.title}
                                    </span>
                                    <span className={`task-priority ${task.priority.toLowerCase()}`}>
                                        {task.priority || 'P3'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Habits */}
                <div className="dashboard-card">
                    <div className="dashboard-card-header">
                        <h3 className="dashboard-card-title">Today&apos;s Habits ({completedHabitsCount}/{habits.length})</h3>
                        <button className="btn btn-sm btn-secondary" onClick={handleCreateHabit}>+ Add Habit</button>
                    </div>
                    <div className="habits-grid">
                        {habits.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
                                No habits tracked yet.
                            </div>
                        ) : (
                            habits.map(habit => (
                                <div key={habit.id} className={`habit-item ${habit.done ? 'done' : ''}`}>
                                    <span className="habit-icon">{habit.icon}</span>
                                    <div className="habit-info">
                                        <div className="habit-name">{habit.name}</div>
                                        <div className="habit-streak">🔥 {habit.streak} days</div>
                                    </div>
                                    <button
                                        className={`habit-check-btn ${habit.done ? 'done' : ''}`}
                                        onClick={() => handleToggleHabit(habit.id, habit.done)}
                                    >
                                        {habit.done ? '✓' : ''}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </>
    );
}
