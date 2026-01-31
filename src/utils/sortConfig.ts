import { orderBy, OrderByDirection } from 'firebase/firestore';
import { TaskSort } from '../features/tasks/types';

export const SORT_CONFIG: Record<
  TaskSort,
  { field: string; direction: OrderByDirection; label: string }
> = {
  updatedAt_desc: { field: 'updatedAt', direction: 'desc', label: 'Date of creation (desc)' },
  updatedAt_asc: { field: 'updatedAt', direction: 'asc', label: 'Date of creation' },
  deadline_asc: { field: 'deadline', direction: 'asc', label: 'Deadline' },
  priority_desc: { field: 'priorityOrder', direction: 'desc', label: 'Priority' },
  completed_asc: { field: 'completed', direction: 'asc', label: '' },
};
