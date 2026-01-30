import { Task } from "../features/tasks/types";

export const validateTask = (task: Partial<Task>) => {
    if (!task.title) throw new Error('Title required');
    if (new Date(task.deadline!).getTime() < Date.now())
      throw new Error('Deadline in past');
  };
  