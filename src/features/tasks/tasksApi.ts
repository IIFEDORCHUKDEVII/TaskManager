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
import { Task } from './types';
export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fakeBaseQuery(),
  endpoints: builder => ({
    realtimeTasks: builder.query<
      { tasks: Task[]; firstCursor?: number },
      { pageSize: number }
    >({
      queryFn: () => ({ data: { tasks: [] } }),
      async onCacheEntryAdded(
        { pageSize },
        { updateCachedData, cacheEntryRemoved },
      ) {
        const q = query(
          collection(db, 'tasks'),
          orderBy('updatedAt', 'desc'),
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
        await addDoc(collection(db, 'tasks'), task);
        return { data: undefined };
      },
    }),

    updateTask: builder.mutation<void, Partial<Task>>({
      async queryFn({ id, ...data }) {
        await updateDoc(doc(db, 'tasks', id!), data);
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
