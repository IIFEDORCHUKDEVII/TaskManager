import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from './types';

interface TasksState {
  localTasks: Task[];
  drafts: Record<string, Partial<Task>>;
}

const initialState: TasksState = {
  localTasks: [],
  drafts: {},
};

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLocalTasks(state, action: PayloadAction<Task[]>) {
      state.localTasks = action.payload;
    },
    saveDraft(state, action: PayloadAction<{ id: string; data: Partial<Task> }>) {
      state.drafts[action.payload.id] = action.payload.data;
    },
    clearDraft(state, action: PayloadAction<string>) {
      delete state.drafts[action.payload];
    },
  },
});

export const { setLocalTasks, saveDraft, clearDraft } = slice.actions;
export const tasksReducer = slice.reducer;
