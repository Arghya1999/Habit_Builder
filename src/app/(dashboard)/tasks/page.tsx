'use client';
import { useState } from 'react';

interface Task {
    id: string;
    title: string;
    priority: 'P1' | 'P2' | 'P3' | 'P4';
    dueDate: string;
    completed: boolean;
    goalTitle?: string;
}

const initialTasks: Task[] = [
    { id: '1', title: 'Complete React module - Section 5', priority: 'P1', dueDate: 'Today', completed: false, goalTitle: 'Learn React' },
    { id: '2', title: 'Write blog post about habit building', priority: 'P1', dueDate: 'Today', completed: false },
    { id: '3', title: 'Review Spanish flashcards (50 cards)', priority: 'P2', dueDate: 'Today', completed: true, goalTitle: 'Learn Spanish' },
    { id: '4', title: 'Meal prep for the week', priority: 'P2', dueDate: 'Today', completed: false, goalTitle: 'Fitness Challenge' },
    { id: '5', title: 'Read chapter 8 of Atomic Habits', priority: 'P2', dueDate: 'Today', completed: false, goalTitle: 'Read 30 Books' },
    { id: '6', title: 'Update portfolio website', priority: 'P3', dueDate: 'Tomorrow', completed: false },
    { id: '7', title: 'Schedule dentist appointment', priority: 'P4', dueDate: 'This Week', completed: false },
    { id: '8', title: 'Clean desk and organize workspace', priority: 'P4', dueDate: 'This Week', completed: true },
];

export default function TasksPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [newTask, setNewTask] = useState('');
    const [newPriority, setNewPriority] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P2');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [focusMode, setFocusMode] = useState(false);

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTask = () => {
        if (!newTask.trim()) return;
        setTasks(prev => [...prev, {
            id: Date.now().toString(),
            title: newTask,
            priority: newPriority,
            dueDate: 'Today',
            completed: false,
        }]);
        setNewTask('');
    };

    let filtered = tasks;
    if (filterPriority !== 'all') filtered = filtered.filter(t => t.priority === filterPriority);
    if (focusMode) filtered = filtered.filter(t => !t.completed && (t.priority === 'P1' || t.priority === 'P2'));

    const sorted = [...filtered].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return a.priority.localeCompare(b.priority);
    });

    const completedCount = tasks.filter(t => t.completed).length;

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Tasks ✅</h1>
                    <p>{completedCount}/{tasks.length} completed today</p>
                </div>
                <button
                    className={`btn ${focusMode ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFocusMode(!focusMode)}
                >
                    {focusMode ? '🎯 Focus Mode ON' : '🎯 Focus Mode'}
                </button>
            </div>

            {/* Add Task */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <input
                        className="input"
                        placeholder="Add a new task..."
                        value={newTask}
                        onChange={e => setNewTask(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTask()}
                    />
                    <select className="input" style={{ width: '100px' }} value={newPriority} onChange={e => setNewPriority(e.target.value as Task['priority'])}>
                        <option value="P1">P1</option>
                        <option value="P2">P2</option>
                        <option value="P3">P3</option>
                        <option value="P4">P4</option>
                    </select>
                    <button className="btn btn-primary" onClick={addTask}>Add</button>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                {['all', 'P1', 'P2', 'P3', 'P4'].map(f => (
                    <button key={f} className={`btn btn-sm ${filterPriority === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilterPriority(f)}>
                        {f === 'all' ? 'All' : f}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="dashboard-card">
                <div className="task-list">
                    {sorted.map(task => (
                        <div key={task.id} className="task-item">
                            <button
                                className={`task-check ${task.completed ? 'completed' : ''}`}
                                onClick={() => toggleTask(task.id)}
                            >
                                {task.completed ? '✓' : ''}
                            </button>
                            <div style={{ flex: 1 }}>
                                <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.title}</span>
                                {task.goalTitle && (
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                                        🎯 {task.goalTitle}
                                    </div>
                                )}
                            </div>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginRight: 'var(--space-2)' }}>{task.dueDate}</span>
                            <span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
