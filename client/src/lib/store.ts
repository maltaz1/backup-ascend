// FlowZone — Global Data Store with localStorage persistence
// Design: Carbon Amber Industrial Premium

import { supabase } from "./supabase.ts";

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  completed: boolean;
  priority: "low" | "medium" | "high";
  category?: string;
  createdAt: string;
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  emoji: string;
  description?: string;
  steps: GoalStep[];
  deadline?: string;
  color: string;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  color: string;
  frequency: "daily" | "weekly";
  completedDates: string[]; // ISO date strings
  createdAt: string;
  targetDays: number; // per month
}

export interface Exercise {
  id: string;
  name: string;
  series: number;
  repMin: number;
  repMax: number;
  restSeconds: number;
}

export interface Workout {
  id: string;
  name: string;
  dayOfWeek: number; // 0-6, Monday=0
  exercises: Exercise[];
  createdAt: string;
}

export interface WorkoutSet {
  weight: number; // kg
  reps: number;
  type: "warmup" | "normal" | "failed" | "drop"; // W, 1, F, D
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutName: string;
  date: string; // ISO date
  durationMinutes: number;
  exercises: Array<{
    exerciseName: string;
    sets: WorkoutSet[];
    totalVolume: number; // weight × reps × sets
  }>;
  totalVolume: number; // volume total do treino
  completedAt: string;
}

export interface FinancialTransaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  date: string;
  createdAt: string;
}

export interface FinancialData {
  transactions: FinancialTransaction[];
}

export interface GymStats {
  totalWorkouts: number;
  totalWorkoutPlans: number;
  totalExercises: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlockedAt?: string;
  condition: string;
}

export interface PrayerMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface PrayerConversation {
  id: string;
  title: string;
  messages: PrayerMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FavoritePrayer {
  id: string;
  content: string;
  timestamp: string;
  addedAt: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  quantity: number; // grams or ml
  unit: "g" | "ml" | "unit";
}

export interface Meal {
  id: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  date: string; // ISO date
  foods: FoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  timestamp: string;
}

export interface DietSettings {
  dailyCalorieGoal: number;
  proteinGoal: number; // grams
  carbsGoal: number; // grams
  fatGoal: number; // grams
  waterGoal: number; // liters
  restrictions: string[]; // allergies, intolerances
  preferences: string[]; // vegetarian, vegan, etc
}

export interface HydrationLog {
  date: string; // ISO date
  cupsConsumed: number;
  goal: number;
}

export interface DietData {
  meals: Meal[];
  settings: DietSettings;
  hydration: HydrationLog[];
  dietPoints: number;
  dietStreak: number;
}

export interface UserProfile {
  name: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  totalTasksCompleted: number;
  totalGoalsCompleted: number;
  achievements: string[]; // achievement ids
}

export interface AppData {
  user: UserProfile;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  achievements: Achievement[];
  workouts: Workout[];
  workoutSessions: WorkoutSession[];
  prayerConversations: PrayerConversation[];
  favoritePrayers: FavoritePrayer[];
  diet: DietData;
  financial: FinancialData;
}

const STORAGE_KEY = "flowzone_data";

const XP_PER_TASK = 10;
const XP_PER_GOAL = 50;
const XP_PER_HABIT = 5;

const XP_FOR_LEVEL = (level: number) => level * 100;

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_task",
    title: "Primeira Tarefa",
    description: "Complete sua primeira tarefa",
    emoji: "✅",
    condition: "tasks_1",
  },
  {
    id: "task_10",
    title: "Produtivo",
    description: "Complete 10 tarefas",
    emoji: "🔥",
    condition: "tasks_10",
  },
  {
    id: "task_50",
    title: "Máquina",
    description: "Complete 50 tarefas",
    emoji: "⚡",
    condition: "tasks_50",
  },
  {
    id: "task_100",
    title: "Lendário",
    description: "Complete 100 tarefas",
    emoji: "👑",
    condition: "tasks_100",
  },
  {
    id: "first_goal",
    title: "Visionário",
    description: "Conclua sua primeira meta",
    emoji: "🎯",
    condition: "goals_1",
  },
  {
    id: "goal_5",
    title: "Conquistador",
    description: "Conclua 5 metas",
    emoji: "🏆",
    condition: "goals_5",
  },
  {
    id: "streak_3",
    title: "Consistente",
    description: "3 dias seguidos ativos",
    emoji: "🌟",
    condition: "streak_3",
  },
  {
    id: "streak_7",
    title: "Semana Perfeita",
    description: "7 dias seguidos ativos",
    emoji: "💎",
    condition: "streak_7",
  },
  {
    id: "streak_30",
    title: "Imparável",
    description: "30 dias seguidos ativos",
    emoji: "🚀",
    condition: "streak_30",
  },
  {
    id: "level_5",
    title: "Nível 5",
    description: "Alcance o nível 5",
    emoji: "⭐",
    condition: "level_5",
  },
  {
    id: "level_10",
    title: "Nível 10",
    description: "Alcance o nível 10",
    emoji: "🌙",
    condition: "level_10",
  },
  {
    id: "habit_master",
    title: "Mestre dos Hábitos",
    description: "Complete um hábito por 7 dias seguidos",
    emoji: "🧠",
    condition: "habit_streak_7",
  },
];

const DEFAULT_DATA: AppData = {
  user: {
    name: "Usuário",
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: "",
    totalTasksCompleted: 0,
    totalGoalsCompleted: 0,
    achievements: [],
  },
  tasks: [],
  goals: [],
  habits: [],
  achievements: DEFAULT_ACHIEVEMENTS,
  workouts: [],
  workoutSessions: [],
  prayerConversations: [],
  favoritePrayers: [],
  diet: {
    meals: [],
    settings: {
      dailyCalorieGoal: 2200,
      proteinGoal: 150,
      carbsGoal: 250,
      fatGoal: 70,
      waterGoal: 2,
      restrictions: [],
      preferences: [],
    },
    hydration: [],
    dietPoints: 0,
    dietStreak: 0,
  },
  financial: {
  transactions: [],
},
};

function generateId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA, achievements: DEFAULT_ACHIEVEMENTS };
    const parsed = JSON.parse(raw) as AppData;
    // Merge achievements in case new ones were added
    const existingIds = new Set(parsed.achievements.map(a => a.id));
    const newAchievements = DEFAULT_ACHIEVEMENTS.filter(
      a => !existingIds.has(a.id)
    );

    // Normalize workouts and sessions to ensure all required fields exist
    const normalizedWorkouts = (parsed.workouts || []).map(w => ({
      ...w,
      exercises: (w.exercises || []).map(ex => ({
        ...ex,
        series: ex.series || 3,
        repMin: ex.repMin || 8,
        repMax: ex.repMax || 12,
        restSeconds: ex.restSeconds || 60,
      })),
    }));

    const normalizedSessions = (parsed.workoutSessions || []).map(s => ({
      ...s,
      exercises: (s.exercises || []).map(ex => ({
        ...ex,
        sets: ex.sets || [],
        totalVolume: ex.totalVolume || 0,
      })),
      totalVolume: s.totalVolume || 0,
    }));

    const normalizedPrayerConversations = (
      parsed.prayerConversations || []
    ).map(c => ({
      ...c,
      messages: c.messages || [],
    }));

    const normalizedFavoritePrayers = parsed.favoritePrayers || [];

    const normalizedDiet = {
      meals: parsed.diet?.meals || [],
      settings: {
        dailyCalorieGoal: parsed.diet?.settings?.dailyCalorieGoal || 2200,
        proteinGoal: parsed.diet?.settings?.proteinGoal || 150,
        carbsGoal: parsed.diet?.settings?.carbsGoal || 250,
        fatGoal: parsed.diet?.settings?.fatGoal || 70,
        waterGoal: parsed.diet?.settings?.waterGoal || 2,
        restrictions: parsed.diet?.settings?.restrictions || [],
        preferences: parsed.diet?.settings?.preferences || [],
      },
      hydration: parsed.diet?.hydration || [],
      dietPoints: parsed.diet?.dietPoints || 0,
      dietStreak: parsed.diet?.dietStreak || 0,
    };

    return {
      ...parsed,
      achievements: [...parsed.achievements, ...newAchievements],
      workouts: normalizedWorkouts,
      workoutSessions: normalizedSessions,
      prayerConversations: normalizedPrayerConversations,
      favoritePrayers: normalizedFavoritePrayers,
      diet: normalizedDiet,
    };
  } catch {
    return { ...DEFAULT_DATA, achievements: DEFAULT_ACHIEVEMENTS };
  }
}

function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Reactive store using event emitter pattern
type Listener = () => void;
const listeners = new Set<Listener>();

export let _data: AppData = loadData();

// Update streak on load
function checkAndUpdateStreak(): void {
  const today = getTodayString();
  const last = _data.user.lastActiveDate;
  if (!last) return;

  const lastDate = new Date(last);
  const todayDate = new Date(today);
  const diffDays = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays > 1) {
    _data.user.streak = 0;
    saveData(_data);
  }
}

checkAndUpdateStreak();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notify(): void {
  listeners.forEach(l => l());
}

export function getData(): AppData {
  return _data;
}

function markActiveToday(): void {
  const today = getTodayString();
  const last = _data.user.lastActiveDate;

  if (last !== today) {
    if (last) {
      const lastDate = new Date(last);
      const todayDate = new Date(today);
      const diffDays = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        _data.user.streak += 1;
      } else if (diffDays > 1) {
        _data.user.streak = 1;
      }
    } else {
      _data.user.streak = 1;
    }
    _data.user.lastActiveDate = today;
  }
}

function addXP(amount: number): void {
  _data.user.xp += amount;
  const xpForNext = XP_FOR_LEVEL(_data.user.level);
  while (_data.user.xp >= xpForNext) {
    _data.user.xp -= xpForNext;
    _data.user.level += 1;
  }
}

function checkAchievements(): string[] {
  const newlyUnlocked: string[] = [];
  const { user, tasks, goals, habits } = _data;

  const checks: Record<string, boolean> = {
    tasks_1: user.totalTasksCompleted >= 1,
    tasks_10: user.totalTasksCompleted >= 10,
    tasks_50: user.totalTasksCompleted >= 50,
    tasks_100: user.totalTasksCompleted >= 100,
    goals_1: user.totalGoalsCompleted >= 1,
    goals_5: user.totalGoalsCompleted >= 5,
    streak_3: user.streak >= 3,
    streak_7: user.streak >= 7,
    streak_30: user.streak >= 30,
    level_5: user.level >= 5,
    level_10: user.level >= 10,
    habit_streak_7: habits.some(h => {
      const today = new Date(getTodayString());
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.toISOString().split("T")[0];
        if (h.completedDates.includes(ds)) streak++;
        else break;
      }
      return streak >= 7;
    }),
  };

  _data.achievements.forEach(a => {
    if (!a.unlockedAt && checks[a.condition]) {
      a.unlockedAt = new Date().toISOString();
      _data.user.achievements.push(a.id);
      newlyUnlocked.push(a.id);
    }
  });

  return newlyUnlocked;
}

// ─── TASKS ────────────────────────────────────────────────────────────────────

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const newTask: Task = {
    ...task,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  _data.tasks.push(newTask);
  saveData(_data);
  notify();
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const idx = _data.tasks.findIndex(t => t.id === id);
  if (idx === -1) return;
  _data.tasks[idx] = { ..._data.tasks[idx], ...updates };
  saveData(_data);
  notify();
}

export function deleteTask(id: string): void {
  _data.tasks = _data.tasks.filter(t => t.id !== id);
  saveData(_data);
  notify();
}

export function completeTask(id: string): {
  xpGained: number;
  newAchievements: string[];
} {
  const task = _data.tasks.find(t => t.id === id);
  if (!task || task.completed) return { xpGained: 0, newAchievements: [] };

  task.completed = true;
  _data.user.totalTasksCompleted += 1;
  markActiveToday();
  addXP(XP_PER_TASK);
  const newAchievements = checkAchievements();
  saveData(_data);
  notify();
  return { xpGained: XP_PER_TASK, newAchievements };
}

export function uncompleteTask(id: string): void {
  const task = _data.tasks.find(t => t.id === id);
  if (!task || !task.completed) return;
  task.completed = false;
  _data.user.totalTasksCompleted = Math.max(
    0,
    _data.user.totalTasksCompleted - 1
  );
  saveData(_data);
  notify();
}

export function getTasksForDate(date: string): Task[] {
  return _data.tasks.filter(t => t.date === date);
}

export function getTaskStatus(task: Task): "completed" | "pending" | "overdue" {
  if (task.completed) return "completed";
  const today = getTodayString();
  if (task.date < today) return "overdue";
  return "pending";
}

// ─── GOALS ────────────────────────────────────────────────────────────────────

export function addGoal(goal: Omit<Goal, "id" | "createdAt">): Goal {
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  _data.goals.push(newGoal);
  saveData(_data);
  notify();
  return newGoal;
}

export function updateGoal(id: string, updates: Partial<Goal>): void {
  const idx = _data.goals.findIndex(g => g.id === id);
  if (idx === -1) return;
  _data.goals[idx] = { ..._data.goals[idx], ...updates };
  saveData(_data);
  notify();
}

export function deleteGoal(id: string): void {
  _data.goals = _data.goals.filter(g => g.id !== id);
  saveData(_data);
  notify();
}

export function toggleGoalStep(
  goalId: string,
  stepId: string
): { xpGained: number; goalCompleted: boolean; newAchievements: string[] } {
  const goal = _data.goals.find(g => g.id === goalId);
  if (!goal) return { xpGained: 0, goalCompleted: false, newAchievements: [] };

  const step = goal.steps.find(s => s.id === stepId);
  if (!step) return { xpGained: 0, goalCompleted: false, newAchievements: [] };

  step.completed = !step.completed;

  let xpGained = 0;
  let goalCompleted = false;

  // Check if all steps are completed
  const allCompleted =
    goal.steps.length > 0 && goal.steps.every(s => s.completed);
  if (allCompleted && !goal.completedAt) {
    goal.completedAt = new Date().toISOString();
    _data.user.totalGoalsCompleted += 1;
    markActiveToday();
    addXP(XP_PER_GOAL);
    xpGained = XP_PER_GOAL;
    goalCompleted = true;
  } else if (!allCompleted && goal.completedAt) {
    goal.completedAt = undefined;
    _data.user.totalGoalsCompleted = Math.max(
      0,
      _data.user.totalGoalsCompleted - 1
    );
  }

  const newAchievements = checkAchievements();
  saveData(_data);
  notify();
  return { xpGained, goalCompleted, newAchievements };
}

export function getGoalProgress(goal: Goal): number {
  if (goal.steps.length === 0) return 0;
  return Math.round(
    (goal.steps.filter(s => s.completed).length / goal.steps.length) * 100
  );
}

// ─── HABITS ───────────────────────────────────────────────────────────────────

export function addHabit(
  habit: Omit<Habit, "id" | "createdAt" | "completedDates">
): Habit {
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    createdAt: new Date().toISOString(),
    completedDates: [],
  };
  _data.habits.push(newHabit);
  saveData(_data);
  // Forçar recarga dos dados para sincronizar
  _data = loadData();
  notify();
  return newHabit;
}

export function updateHabit(id: string, updates: Partial<Habit>): void {
  const idx = _data.habits.findIndex(h => h.id === id);
  if (idx === -1) return;
  _data.habits[idx] = { ..._data.habits[idx], ...updates };
  saveData(_data);
  notify();
}

export function deleteHabit(id: string): void {
  _data.habits = _data.habits.filter(h => h.id !== id);
  saveData(_data);
  notify();
}

export function toggleHabitDate(
  habitId: string,
  date: string
): { xpGained: number } {
  const habit = _data.habits.find(h => h.id === habitId);
  if (!habit) return { xpGained: 0 };

  const idx = habit.completedDates.indexOf(date);
  let xpGained = 0;

  if (idx === -1) {
    habit.completedDates.push(date);
    markActiveToday();
    addXP(XP_PER_HABIT);
    xpGained = XP_PER_HABIT;
    checkAchievements();
  } else {
    habit.completedDates.splice(idx, 1);
  }

  saveData(_data);
  // Forçar recarga dos dados para sincronizar
  _data = loadData();
  notify();
  return { xpGained };
}

export function getHabitMonthProgress(
  habit: Habit,
  year: number,
  month: number
): number {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let completed = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    if (habit.completedDates.includes(dateStr)) completed++;
  }
  return completed;
}

export function getHabitMonthRate(
  habit: Habit,
  year: number,
  month: number
): number {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const daysToCount = isCurrentMonth
    ? today.getDate()
    : new Date(year, month + 1, 0).getDate();
  const completed = getHabitMonthProgress(habit, year, month);
  return Math.round((completed / daysToCount) * 100);
}

export function getHabitStreak(habit: Habit): number {
  const today = new Date(getTodayString());
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    if (habit.completedDates.includes(ds)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ─── USER ─────────────────────────────────────────────────────────────────────

export function updateUserName(name: string): void {
  _data.user.name = name;
  saveData(_data);
  notify();
}

export function getLevelProgress(): {
  current: number;
  max: number;
  percent: number;
} {
  const max = XP_FOR_LEVEL(_data.user.level);
  return {
    current: _data.user.xp,
    max,
    percent: Math.round((_data.user.xp / max) * 100),
  };
}

export function getTodayStats(): {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
} {
  const today = getTodayString();
  const todayTasks = _data.tasks.filter(t => t.date === today);
  const habitsCompleted = _data.habits.filter(h =>
    h.completedDates.includes(today)
  ).length;

  return {
    tasksCompleted: todayTasks.filter(t => t.completed).length,
    tasksTotal: todayTasks.length,
    habitsCompleted,
    habitsTotal: _data.habits.length,
  };
}

export function getWeeklyData(): {
  day: string;
  tasks: number;
  habits: number;
}[] {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("pt-BR", { weekday: "short" });

    const tasks = _data.tasks.filter(
      t => t.date === dateStr && t.completed
    ).length;
    const habits = _data.habits.filter(h =>
      h.completedDates.includes(dateStr)
    ).length;

    result.push({ day: dayName, tasks, habits });
  }

  return result;
}

export function getDailyHabitData(
  year: number,
  month: number,
  habits?: Habit[]
): { day: number; count: number }[] {
  const habitsToUse = habits || _data.habits;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const count = habitsToUse.filter(h =>
      h.completedDates.includes(dateStr)
    ).length;
    result.push({ day: d, count });
  }

  return result;
}

export function getWeeklyHabitData(
  year: number,
  month: number,
  habits?: Habit[]
): { week: string; count: number }[] {
  const habitsToUse = habits || _data.habits;
  const weeks = ["Sem 1", "Sem 2", "Sem 3", "Sem 4"];
  return weeks.map((week, i) => {
    const startDay = i * 7 + 1;
    const endDay = Math.min(
      (i + 1) * 7,
      new Date(year, month + 1, 0).getDate()
    );
    let count = 0;

    for (let d = startDay; d <= endDay; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      count += habitsToUse.filter(h =>
        h.completedDates.includes(dateStr)
      ).length;
    }

    return { week, count };
  });
}

// ─── ACADEMY (WORKOUTS) ──────────────────────────────────────────────────────

const XP_PER_WORKOUT = 25;

export async function addWorkout(
  workout: Omit<Workout, "id" | "createdAt">
): Promise<Workout | null> {
  const { data: userData } = await supabase.auth.getUser();

  const workoutToInsert = {
    user_id: userData.user?.id,
    name: workout.name,
    day_of_week: workout.dayOfWeek,
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("workouts")
    .insert([workoutToInsert])
    .select()
    .single();

  const newWorkout: Workout = {
    id: data.id,
    name: workout.name,
    dayOfWeek: workout.dayOfWeek,
    exercises: workout.exercises || [],
    createdAt: data.created_at,
  };

  _data.workouts.push(newWorkout);

  saveData(_data);
  notify();

  return newWorkout;
}

export async function updateWorkout(
  id: string,
  updates: Partial<Omit<Workout, "id" | "createdAt">>
): Promise<void> {
  const updatesToDb: any = {};

  if (updates.name !== undefined) {
    updatesToDb.name = updates.name;
  }

  if (updates.dayOfWeek !== undefined) {
    updatesToDb.day_of_week = updates.dayOfWeek;
  }

  if (updates.exercises !== undefined) {
    updatesToDb.exercises = updates.exercises;
  }

  const { error } = await supabase
    .from("workouts")
    .update(updatesToDb)
    .eq("id", id);

  if (error) {
    console.error("Erro ao atualizar treino:", error);
    return;
  }

  const workout = _data.workouts.find(w => w.id === id);

  if (workout) {
    Object.assign(workout, updates);
  }

  saveData(_data);
  notify();
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar treino:", error);
    return;
  }

  _data.workouts = _data.workouts.filter(w => w.id !== id);

  notify();
}

export function getWorkouts(): Workout[] {
  return _data.workouts;
}

export async function addWorkoutSession(
  session: Omit<WorkoutSession, "id" | "completedAt">
): Promise<WorkoutSession | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessionToInsert = {
    user_id: user?.id,
    workout_id: session.workoutId,
    workout_name: session.workoutName,
    date: session.date,
    duration_minutes: session.durationMinutes,
    exercises: session.exercises,
    total_volume: session.totalVolume,
    completed_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("workout_sessions")
    .insert([sessionToInsert])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar sessão:", error);
    return null;
  }

  const newSession: WorkoutSession = {
    id: data.id,
    workoutId: data.workout_id,
    workoutName: data.workout_name,
    date: data.date,
    durationMinutes: data.duration_minutes,
    exercises: data.exercises || [],
    totalVolume: data.total_volume || 0,
    completedAt: data.completed_at,
  };

  _data.workoutSessions.push(newSession);

  markActiveToday();
  addXP(XP_PER_WORKOUT);
  checkAchievements();

  notify();

  return newSession;
}

export async function deleteWorkoutSession(id: string): Promise<void> {
  const { error } = await supabase
    .from("workout_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar sessão:", error);
    return;
  }

  _data.workoutSessions = _data.workoutSessions.filter(s => s.id !== id);

  notify();
}

export function getWorkoutSessions(): WorkoutSession[] {
  return [...(_data.workoutSessions ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getGymStats(): GymStats {
  const totalExercises = (_data.workouts ?? []).reduce(
    (sum, w) => sum + (w.exercises ?? []).length,
    0
  );

  return {
    totalWorkouts: (_data.workoutSessions ?? []).length,
    totalWorkoutPlans: (_data.workouts ?? []).length,
    totalExercises,
  };
}

export function getWorkoutProgressData(): { date: string; weight: number }[] {
  const result: { date: string; weight: number }[] = [];

  (_data.workoutSessions ?? []).forEach(session => {
    const exercises = session.exercises ?? [];

    const avgWeight =
      exercises.reduce((sum, ex) => {
        const sets = ex.sets ?? [];

        const exAvg =
          sets.reduce((s, set) => s + set.weight, 0) / Math.max(sets.length, 1);

        return sum + exAvg;
      }, 0) / Math.max(exercises.length, 1);

    result.push({
      date: session.date,
      weight: avgWeight,
    });
  });

  return result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export function getExerciseProgressData(
  exerciseName: string
): { date: string; weight: number; volume: number }[] {
  const result: {
    date: string;
    weight: number;
    volume: number;
  }[] = [];

  (_data.workoutSessions ?? []).forEach(session => {
    const exercises = session.exercises ?? [];

    const exercise = exercises.find(ex => ex.exerciseName === exerciseName);

    if (exercise) {
      const sets = exercise.sets ?? [];

      const avgWeight =
        sets.reduce((sum, set) => sum + set.weight, 0) /
        Math.max(sets.length, 1);

      result.push({
        date: session.date,
        weight: avgWeight,
        volume: exercise.totalVolume,
      });
    }
  });

  return result.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

export {
  getTodayString,
  generateId,
  XP_PER_TASK,
  XP_PER_GOAL,
  XP_PER_HABIT,
  XP_PER_WORKOUT,
};

// Prayer functions
export function createPrayerConversation(title: string): PrayerConversation {
  const id = generateId();
  const now = new Date().toISOString();
  const conversation: PrayerConversation = {
    id,
    title,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
  if (!_data.prayerConversations) {
    _data.prayerConversations = [];
  }
  _data.prayerConversations.push(conversation);
  saveData(_data);
  notify();
  return conversation;
}

export function getPrayerConversations(): PrayerConversation[] {
  return _data.prayerConversations || [];
}

export function getPrayerConversation(
  id: string
): PrayerConversation | undefined {
  return _data.prayerConversations?.find(c => c.id === id);
}

export function addPrayerMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
): PrayerMessage | null {
  const conversation = _data.prayerConversations?.find(
    c => c.id === conversationId
  );
  if (!conversation) return null;

  const message: PrayerMessage = {
    id: generateId(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };

  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();

  // Update title if it's the first user message
  if (
    role === "user" &&
    conversation.messages.filter(m => m.role === "user").length === 1
  ) {
    conversation.title =
      content.substring(0, 50) + (content.length > 50 ? "..." : "");
  }

  saveData(_data);
  notify();
  return message;
}

export function deletePrayerConversation(id: string): void {
  _data.prayerConversations =
    _data.prayerConversations?.filter(c => c.id !== id) || [];
  saveData(_data);
  notify();
}

// Favorite prayers functions
export function addFavoritePrayer(
  content: string,
  timestamp: string
): FavoritePrayer {
  const id = generateId();
  const now = new Date().toISOString();
  const favorite: FavoritePrayer = {
    id,
    content,
    timestamp,
    addedAt: now,
  };
  if (!_data.favoritePrayers) {
    _data.favoritePrayers = [];
  }
  _data.favoritePrayers.push(favorite);
  saveData(_data);
  notify();
  return favorite;
}

export function getFavoritePrayers(): FavoritePrayer[] {
  return _data.favoritePrayers || [];
}

export function removeFavoritePrayer(id: string): void {
  _data.favoritePrayers = _data.favoritePrayers?.filter(p => p.id !== id) || [];
  saveData(_data);
  notify();
}

export function isFavoritePrayer(content: string): boolean {
  return (_data.favoritePrayers || []).some(p => p.content === content);
}

// Diet functions

export async function loadDietData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  // ───────────── REFEIÇÕES ─────────────
  const { data: mealsData, error: mealsError } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id);

  if (mealsError) {
    console.error("Erro ao carregar refeições:", mealsError);
    return;
  }

  _data.diet.meals = (mealsData || []).map(meal => ({
    id: meal.id,
    type: meal.type,
    date: meal.date,
    foods: meal.foods,
    totalCalories: meal.total_calories,
    totalProtein: meal.total_protein,
    totalCarbs: meal.total_carbs,
    totalFat: meal.total_fat,
    timestamp: meal.timestamp,
  }));

  // ───────────── HIDRATAÇÃO ─────────────
  const { data: hydrationData, error: hydrationError } = await supabase
    .from("hydration_logs")
    .select("*")
    .eq("user_id", user.id);

  if (hydrationError) {
    console.error("Erro ao carregar hidratação:", hydrationError);
    return;
  }

  _data.diet.hydration = (hydrationData || []).map(h => ({
    date: h.date,
    cupsConsumed: h.cups_consumed,
    goal: h.goal,
  }));

  // ───────────── CONFIGURAÇÕES ─────────────
  const { data: settingsData } = await supabase
    .from("diet_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (settingsData) {
    _data.diet.settings = {
      dailyCalorieGoal: settingsData.daily_calorie_goal || 2200,
      proteinGoal: settingsData.protein_goal || 150,
      carbsGoal: settingsData.carbs_goal || 250,
      fatGoal: settingsData.fat_goal || 70,
      waterGoal: settingsData.water_goal || 2,
      restrictions: settingsData.restrictions || [],
      preferences: settingsData.preferences || [],
    };
  }

  saveData(_data);
  notify();
}

export async function addMeal(meal: Omit<Meal, "id" | "timestamp">) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Usuário não encontrado");
    return;
  }

  const newMeal = {
    user_id: user.id,
    type: meal.type,
    date: meal.date,
    foods: meal.foods,
    total_calories: meal.totalCalories,
    total_protein: meal.totalProtein,
    total_carbs: meal.totalCarbs,
    total_fat: meal.totalFat,
  };

  const { data, error } = await supabase
    .from("meals")
    .insert([newMeal])
    .select()
    .single();

  if (error) {
    console.error("Erro ao adicionar refeição:", error);
    return;
  }

  _data.diet.meals.push({
    id: data.id,
    type: data.type,
    date: data.date,
    foods: data.foods,
    totalCalories: data.total_calories,
    totalProtein: data.total_protein,
    totalCarbs: data.total_carbs,
    totalFat: data.total_fat,
    timestamp: new Date().toISOString(),
  });

  saveData(_data);
  notify();
}

export function getMealsForDate(date: string): Meal[] {
  return _data.diet.meals.filter(m => m.date === date);
}

export function updateMeal(id: string, updates: Partial<Meal>): void {
  const idx = _data.diet.meals.findIndex(m => m.id === id);
  if (idx === -1) return;
  _data.diet.meals[idx] = { ..._data.diet.meals[idx], ...updates };
  saveData(_data);
  notify();
}

export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase.from("meals").delete().eq("id", id);

  if (error) {
    console.error("Erro ao deletar refeição:", error);
    return;
  }

  _data.diet.meals = _data.diet.meals.filter(m => m.id !== id);

  notify();
}

export function getTodayMeals(): Meal[] {
  return getMealsForDate(getTodayString());
}

export function getTodayNutrition() {
  const meals = getTodayMeals();
  return {
    calories: meals.reduce((sum, m) => sum + m.totalCalories, 0),
    protein: meals.reduce((sum, m) => sum + m.totalProtein, 0),
    carbs: meals.reduce((sum, m) => sum + m.totalCarbs, 0),
    fat: meals.reduce((sum, m) => sum + m.totalFat, 0),
  };
}

export async function updateDietSettings(
  settings: DietSettings
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const payload = {
    user_id: user.id,
    daily_calorie_goal: settings.dailyCalorieGoal,
    protein_goal: settings.proteinGoal,
    carbs_goal: settings.carbsGoal,
    fat_goal: settings.fatGoal,
    water_goal: settings.waterGoal,
    restrictions: settings.restrictions,
    preferences: settings.preferences,
  };

  const { error } = await supabase.from("diet_settings").upsert(payload, {
    onConflict: "user_id",
  });

  if (error) {
    console.error("Erro ao salvar metas:", error);
    return;
  }

  _data.diet.settings = settings;

  saveData(_data);

  notify();
}

export async function addWaterCup(): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  const existingHydration = _data.diet.hydration.find(h => h.date === today);

  // ───────── UPDATE LOCAL IMEDIATO ─────────
  if (existingHydration) {
    existingHydration.cupsConsumed += 1;
  } else {
    _data.diet.hydration.push({
      date: today,
      cupsConsumed: 1,
      goal: _data.diet.settings.waterGoal * 4,
    });
  }

  notify();

  // ───────── SALVA NO SUPABASE ─────────
  const { data: existingRows } = await supabase
    .from("hydration_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", today);

  const existing = existingRows?.[0];

  if (existing) {
    await supabase
      .from("hydration_logs")
      .update({
        cups_consumed: existing.cups_consumed + 1,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("hydration_logs").insert([
      {
        user_id: user.id,
        date: today,
        cups_consumed: 1,
        goal: _data.diet.settings.waterGoal * 4,
      },
    ]);
  }

  saveData(_data);
}

export function getTodayHydration() {
  const today = getTodayString();
  return (
    _data.diet.hydration.find(h => h.date === today) || {
      date: today,
      cupsConsumed: 0,
      goal: _data.diet.settings.waterGoal * 4,
    }
  );
}

export function addDietPoints(points: number): void {
  _data.diet.dietPoints += points;
  saveData(_data);
  notify();
}

export function getDietData() {
  return _data.diet;
}

export async function getDietSettings(): Promise<DietSettings | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("diet_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Erro ao buscar metas:", error);
    return null;
  }

  return {
    dailyCalorieGoal: data.daily_calorie_goal,
    proteinGoal: data.protein_goal,
    carbsGoal: data.carbs_goal,
    fatGoal: data.fat_goal,
    waterGoal: data.water_goal,
    restrictions: data.restrictions || [],
    preferences: data.preferences || [],
  };
}

// ───────── FINANCIAL ─────────

export async function loadFinancialData() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("financial_transactions")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error("Erro ao carregar finanças:", error);
    return;
  }

  _data.financial.transactions = (data || []).map(item => ({
    id: item.id,
    title: item.title,
    amount: Number(item.amount),
    type: item.type,
    category: item.category,
    date: item.date,
    createdAt: item.created_at,
  }));

  saveData(_data);
  notify();
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from("financial_transactions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao deletar transação:", error);
    return;
  }

  _data.financial.transactions =
    _data.financial.transactions.filter(t => t.id !== id);

  saveData(_data);
  notify();
}

export function getFinancialData() {
  return _data.financial;
}

export async function addTransaction(transaction: {
  title: string;
  amount: number;
  type: "income" | "expense";
  category?: string;
  date: string;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { data, error } = await supabase
    .from("financial_transactions")
    .insert([
      {
        user_id: user.id,
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  _data.financial.transactions.push({
    id: data.id,
    title: data.title,
    amount: Number(data.amount),
    type: data.type,
    category: data.category,
    date: data.date,
    createdAt: data.created_at,
  });

  saveData(_data);
  notify();
}
