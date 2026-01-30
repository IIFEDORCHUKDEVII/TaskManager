// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { tasksReducer } from '../features/tasks/tasksSlice';
// import { settingsReducer } from '../features/settings/settingsSlice';
import { tasksApi } from '../features/tasks/tasksApi';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    // settings: settingsReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
  },
  middleware: getDefault =>
    getDefault().concat(
        tasksApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
