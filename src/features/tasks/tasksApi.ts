import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  query,
  collection,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  endBefore,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Task, TaskSort } from './types';
import { loadTasksLocal, saveTasksLocal } from '../../services/storage';
import { SORT_CONFIG } from '../../utils/sortConfig';
export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    realtimeTasks: builder.query<
      { tasks: Task[]; firstCursor?: number },
      { pageSize: number; sort: TaskSort }
    >({
      queryFn: async () => {
        const cached = await loadTasksLocal();
        return { data: { tasks: cached } };
      },
      async onCacheEntryAdded(
        { pageSize, sort },
        { updateCachedData, cacheEntryRemoved },
      ) {
        const { field, direction } = SORT_CONFIG[sort];

        const q = query(
          collection(db, 'tasks'),
          orderBy(field, direction),
          limit(pageSize),
        );

        const unsub = onSnapshot(q, snap => {
          const tasks = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            updatedAt: d.data().updatedAt as number, // number, як ти зберігаєш
          })) as Task[];

          updateCachedData(() => ({
            tasks,
            firstCursor: tasks.length
              ? tasks[tasks.length - 1].updatedAt // останній елемент
              : undefined,
          }));
          saveTasksLocal(tasks);
        });
        await cacheEntryRemoved;
        unsub();
      },
    }),

    // 🔵 2. PAGINATION (старі задачі)
    loadMoreTasks: builder.query<
      { tasks: Task[]; lastCursor?: number; hasMore: boolean },
      { pageSize: number; lastCursor: number }
    >({
      async queryFn({ pageSize, lastCursor }) {
        try {
          const q = query(
            collection(db, 'tasks'),
            orderBy('updatedAt', 'desc'),
            startAfter(lastCursor), // просто number
            limit(pageSize),
          );

          const snap = await getDocs(q);

          const tasks = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            updatedAt: d.data().updatedAt as number,
          })) as Task[];

          return {
            data: {
              tasks,
              lastCursor: tasks.length
                ? tasks[tasks.length - 1].updatedAt
                : undefined,
              hasMore: tasks.length === pageSize,
            },
          };
        } catch (e) {
          return { error: e as Error };
        }
      },
    }),
    addTask: builder.mutation<void, Task>({
      async queryFn(task) {
        try {
          await addDoc(collection(db, 'tasks'), {
            ...task,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          return { data: undefined };
        } catch (e) {
          return { error: e as any };
        }
      },
    }),

    updateTask: builder.mutation<void, { id: string; data: Partial<Task> }>({
      async queryFn({ id, data }) {
        if (!id) {
          return { error: { message: 'Task id is required' } as any };
        }

        if (!Object.keys(data).length) {
          return { data: undefined };
        }

        await updateDoc(doc(db, 'tasks', 'RGPsGLKcpbucdMfuZTpB'), {
          ...data,
          updatedAt: Date.now(),
        });

        return { data: undefined };
      },
    }),

    deleteTask: builder.mutation<void, string>({
      async queryFn(id) {
        await deleteDoc(doc(db, 'tasks', id));
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useRealtimeTasksQuery,
  useLazyLoadMoreTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
