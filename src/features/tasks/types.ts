export type PriorityTask = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: PriorityTask;
  category?: string;
  createdAt: number; // number для Redux
  updatedAt: number;
  deadline: string; // 🔥 number
}
