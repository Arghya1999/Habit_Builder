// ===== RoutineForge Type Definitions =====

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';
export type GoalStatus = 'active' | 'completed' | 'paused' | 'failed';
export type GoalCategory = 'health' | 'career' | 'learning' | 'finance' | 'personal' | 'custom';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type SubscriptionPlan = 'free' | 'pro' | 'premium' | 'team';
export type MoodScore = 1 | 2 | 3 | 4 | 5;

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    plan: SubscriptionPlan;
    level: number;
    xp: number;
    joinedAt: string;
}

export interface Goal {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: GoalCategory;
    durationDays: number;
    startDate: string;
    endDate: string;
    status: GoalStatus;
    progress: number; // 0-100
    currentStreak: number;
    tasks: Task[];
    createdAt: string;
}

export interface Task {
    id: string;
    userId: string;
    goalId?: string;
    title: string;
    description?: string;
    priority: Priority;
    dueDate?: string;
    completed: boolean;
    completedAt?: string;
    recurring: boolean;
    subtasks: SubTask[];
    createdAt: string;
}

export interface SubTask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Habit {
    id: string;
    userId: string;
    name: string;
    description?: string;
    icon: string;
    color: string;
    frequency: HabitFrequency;
    timeOfDay: TimeOfDay;
    currentStreak: number;
    bestStreak: number;
    totalCompletions: number;
    logs: HabitLog[];
    createdAt: string;
}

export interface HabitLog {
    id: string;
    habitId: string;
    date: string;
    completed: boolean;
    note?: string;
}

export interface Routine {
    id: string;
    userId: string;
    name: string;
    timeOfDay: TimeOfDay;
    steps: RoutineStep[];
    activeDays: number[]; // 0=Sun, 6=Sat
    createdAt: string;
}

export interface RoutineStep {
    id: string;
    title: string;
    duration: number; // minutes
    order: number;
    completed: boolean;
}

export interface JournalEntry {
    id: string;
    userId: string;
    date: string;
    conversation: ConversationMessage[];
    summary: string;
    moodScore: MoodScore;
    energyScore: MoodScore;
    gratitude: string[];
    tomorrowPlan: string;
    createdAt: string;
}

export interface ConversationMessage {
    role: 'ai' | 'user';
    content: string;
    timestamp: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: string;
    requirement: string;
}

export interface AnalyticsData {
    productivityScore: number;
    tasksCompleted: number;
    tasksTotal: number;
    habitsCompleted: number;
    habitsTotal: number;
    currentStreak: number;
    weeklyData: WeeklyData[];
    heatmapData: HeatmapDay[];
}

export interface WeeklyData {
    day: string;
    tasks: number;
    habits: number;
    score: number;
}

export interface HeatmapDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface PricingPlan {
    name: string;
    price: number;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
    cta: string;
}
