'use client';
import { useState } from 'react';

interface RoutineStep {
    id: string;
    title: string;
    duration: number;
    completed: boolean;
}

interface Routine {
    id: string;
    name: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening';
    icon: string;
    steps: RoutineStep[];
    adherenceRate: number;
}

const mockRoutines: Routine[] = [
    {
        id: '1', name: 'Morning Power-Up', timeOfDay: 'morning', icon: '🌅', adherenceRate: 85,
        steps: [
            { id: 's1', title: 'Wake up at 6:00 AM', duration: 0, completed: true },
            { id: 's2', title: 'Drink warm lemon water', duration: 5, completed: true },
            { id: 's3', title: 'Meditation & breathing', duration: 15, completed: true },
            { id: 's4', title: 'Exercise / Workout', duration: 45, completed: false },
            { id: 's5', title: 'Cold shower', duration: 10, completed: false },
            { id: 's6', title: 'Healthy breakfast', duration: 20, completed: false },
            { id: 's7', title: 'Review today\'s tasks & goals', duration: 10, completed: false },
        ]
    },
    {
        id: '2', name: 'Evening Wind-Down', timeOfDay: 'evening', icon: '🌙', adherenceRate: 72,
        steps: [
            { id: 's8', title: 'Review completed tasks', duration: 10, completed: true },
            { id: 's9', title: 'Journal / AI daily review', duration: 15, completed: false },
            { id: 's10', title: 'Read for 30 minutes', duration: 30, completed: false },
            { id: 's11', title: 'Prepare tomorrow\'s clothes', duration: 5, completed: false },
            { id: 's12', title: 'Screens off by 10:30 PM', duration: 0, completed: false },
            { id: 's13', title: 'Gratitude — 3 things', duration: 5, completed: false },
        ]
    },
    {
        id: '3', name: 'Work Focus Block', timeOfDay: 'afternoon', icon: '💻', adherenceRate: 90,
        steps: [
            { id: 's14', title: 'Close all social media', duration: 2, completed: true },
            { id: 's15', title: 'Set Pomodoro timer (25 min)', duration: 25, completed: true },
            { id: 's16', title: 'Deep work on P1 tasks', duration: 50, completed: true },
            { id: 's17', title: '5-min break + stretch', duration: 5, completed: false },
            { id: 's18', title: 'Second Pomodoro block', duration: 25, completed: false },
        ]
    },
];

const weekData = [
    { day: 'Mon', morning: 100, evening: 80 },
    { day: 'Tue', morning: 85, evening: 70 },
    { day: 'Wed', morning: 100, evening: 90 },
    { day: 'Thu', morning: 70, evening: 60 },
    { day: 'Fri', morning: 85, evening: 85 },
    { day: 'Sat', morning: 100, evening: 100 },
    { day: 'Sun', morning: 90, evening: 0 },
];

export default function RoutinesPage() {
    const [routines, setRoutines] = useState(mockRoutines);

    const toggleStep = (routineId: string, stepId: string) => {
        setRoutines(prev => prev.map(r =>
            r.id === routineId
                ? { ...r, steps: r.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s) }
                : r
        ));
    };

    return (
        <>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1>Routines ⏰</h1>
                    <p>Build and follow your daily routines step by step</p>
                </div>
                <button className="btn btn-primary">+ New Routine</button>
            </div>

            {/* Weekly Adherence */}
            <div className="dashboard-card" style={{ marginBottom: 'var(--space-6)' }}>
                <h3 className="dashboard-card-title" style={{ marginBottom: 'var(--space-4)' }}>Weekly Adherence</h3>
                <div style={{ display: 'flex', gap: 'var(--space-6)', justifyContent: 'space-around' }}>
                    {weekData.map((day, i) => (
                        <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-2)' }}>{day.day}</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                                    background: `rgba(0, 206, 201, ${day.morning / 100 * 0.5 + 0.1})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 600, color: day.morning > 60 ? 'var(--secondary)' : 'var(--text-tertiary)',
                                }}>
                                    {day.morning}%
                                </div>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                                    background: `rgba(108, 92, 231, ${day.evening / 100 * 0.5 + 0.1})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '11px', fontWeight: 600, color: day.evening > 60 ? 'var(--primary-light)' : 'var(--text-tertiary)',
                                }}>
                                    {day.evening}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginTop: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                    <span>🟢 Morning</span>
                    <span>🟣 Evening</span>
                </div>
            </div>

            {/* Routines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {routines.map(routine => {
                    const completed = routine.steps.filter(s => s.completed).length;
                    const total = routine.steps.length;
                    const totalMinutes = routine.steps.reduce((sum, s) => sum + s.duration, 0);

                    return (
                        <div key={routine.id} className="dashboard-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span style={{ fontSize: 'var(--text-2xl)' }}>{routine.icon}</span>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{routine.name}</div>
                                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                            {totalMinutes} min · {completed}/{total} steps · {routine.adherenceRate}% adherence
                                        </div>
                                    </div>
                                </div>
                                <span className={`badge ${completed === total ? 'badge-success' : 'badge-primary'}`}>
                                    {completed === total ? '✓ Done' : `${completed}/${total}`}
                                </span>
                            </div>

                            <div className="progress-bar" style={{ marginBottom: 'var(--space-4)', height: '6px' }}>
                                <div className="progress-bar-fill" style={{ width: `${(completed / total) * 100}%` }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {routine.steps.map((step, idx) => (
                                    <div key={step.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                        padding: 'var(--space-3) var(--space-4)',
                                        background: 'var(--bg-glass)',
                                        borderRadius: 'var(--radius-lg)',
                                        opacity: step.completed ? 0.7 : 1,
                                    }}>
                                        <button
                                            className={`task-check ${step.completed ? 'completed' : ''}`}
                                            onClick={() => toggleStep(routine.id, step.id)}
                                        >
                                            {step.completed ? '✓' : ''}
                                        </button>
                                        <span style={{
                                            fontSize: 'var(--text-sm)',
                                            textDecoration: step.completed ? 'line-through' : 'none',
                                            color: step.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                            flex: 1,
                                        }}>
                                            {step.title}
                                        </span>
                                        {step.duration > 0 && (
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                                                {step.duration} min
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
