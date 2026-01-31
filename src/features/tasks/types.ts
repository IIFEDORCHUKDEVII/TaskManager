export type PriorityTask = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: number;
  category?: string;
  createdAt: number; // number для Redux
  updatedAt: number;
  deadline: string; // 🔥 number
}

export type TaskSort =
  | 'updatedAt_desc'
  | 'updatedAt_asc'
  | 'deadline_asc'
  | 'priority_desc'
  | 'completed_asc';
