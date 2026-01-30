import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../features/tasks/types';

export const saveTasksLocal = async (tasks: Task[]) => {
  await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
};

export const loadTasksLocal = async (): Promise<Task[]> => {
  const data = await AsyncStorage.getItem('TASKS');
  return data ? JSON.parse(data) : [];
};
