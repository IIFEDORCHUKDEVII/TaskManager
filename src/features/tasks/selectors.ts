import { RootState } from '../../app/store';
import { Task } from './types';

// ==========================
// Базовий селектор — всі задачі
// ==========================
export const selectAllTasks = (state: RootState): Task[] =>
  state.tasks.localTasks;

// ==========================
// Селектор за статусом completed / uncompleted
// ==========================
export const selectTasksByStatus = (completed: boolean) => (state: RootState) =>
  state.tasks.localTasks.filter(task => task.completed === completed);

// ==========================
// Селектор за пріоритетом
// ==========================
export const selectTasksByPriority =
  (priority: 'low' | 'medium' | 'high') => (state: RootState) =>
    state.tasks.localTasks.filter(task => task.priority === priority);

// ==========================
// Селектор за категорією
// ==========================
export const selectTasksByCategory =
  (categoryId: string) => (state: RootState) =>
    state.tasks.localTasks.filter(task => task.categoryId === categoryId);

// ==========================
// Селектор за дедлайном (після певної дати)
// ==========================
export const selectTasksByDeadline = (after: Date) => (state: RootState) =>
  state.tasks.localTasks.filter(task => new Date(task.deadline) >= after);

// ==========================
// Пошук по title + description (full-text)
// ==========================
export const selectTasksBySearch = (query: string) => (state: RootState) => {
  const q = query.toLowerCase();
  return state.tasks.localTasks.filter(
    task =>
      task.title.toLowerCase().includes(q) ||
      (task.description?.toLowerCase().includes(q) ?? false),
  );
};

// ==========================
// Сортування (priority > deadline > status)
// ==========================
export const selectTasksSorted = (state: RootState): Task[] => {
  return [...state.tasks.localTasks].sort((a, b) => {
    // 1️⃣ Priority: high > medium > low
    const priorityMap: { high: number; medium: number; low: number } = {
      high: 3,
      medium: 2,
      low: 1,
    };
    if (priorityMap[b.priority as keyof typeof priorityMap] !== priorityMap[a.priority as keyof typeof priorityMap])
      return priorityMap[b.priority as keyof typeof priorityMap] - priorityMap[a.priority as keyof typeof priorityMap];

    // 2️⃣ Deadline: ближчий дедлайн перший
    const deadlineA = new Date(a.deadline).getTime();
    const deadlineB = new Date(b.deadline).getTime();
    if (deadlineA !== deadlineB) return deadlineA - deadlineB;

    // 3️⃣ Completed status: не виконані перші
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    return 0;
  });
};
