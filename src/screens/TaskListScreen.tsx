import React, { useEffect, useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {
  useDeleteTaskMutation,
  useLazyLoadMoreTasksQuery,
  useRealtimeTasksQuery,
} from '../features/tasks/tasksApi';
import TaskItem from '../components/TaskItem';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Task, TaskSort } from '../features/tasks/types';
import SearchSettingPanel from '../components/SearchSettingPanel';
import SortMenu from '../components/SortMenu';

const PAGE_SIZE = 10;

type TaskListNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskList'
>;

export const TaskListScreen: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<string>('updatedAt_desc');

  const { data: realtimeData } = useRealtimeTasksQuery({
    pageSize: PAGE_SIZE,
    sort: sort as TaskSort,
  });
  const [loadMoreTasks, { data: moreData, isFetching }] =
    useLazyLoadMoreTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();
  const navigation = useNavigation<TaskListNavProp>();

  // Handle realtime updates (first page)
  useEffect(() => {
    if (realtimeData?.tasks) {
      setTasks(realtimeData.tasks);
      setCursor(realtimeData.firstCursor ?? null);
    }
  }, [realtimeData]);

  // Handle paginated loads for subsequent pages
  useEffect(() => {
    if (moreData?.tasks) {
      setTasks(prevTasks => [...prevTasks, ...moreData.tasks]);
      setCursor(moreData.lastCursor ?? null);
      setHasMore(moreData.hasMore);
    }
  }, [moreData]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && cursor !== null) {
      loadMoreTasks({ pageSize: PAGE_SIZE, lastCursor: cursor });
    }
  }, [hasMore, cursor, loadMoreTasks]);

  const handleTaskDelete = useCallback(
    (id: string) => deleteTask(id),
    [deleteTask],
  );

  const handleNavigateToTaskForm = useCallback(() => {
    navigation.navigate('TaskForm');
  }, [navigation]);

  const renderTaskItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem task={item} onDelete={() => handleTaskDelete(item.id)} />
    ),
    [handleTaskDelete],
  );

  const renderFAB = () => (
    <TouchableOpacity style={styles.fab} onPress={handleNavigateToTaskForm}>
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <SearchSettingPanel setSort={setSort}/>
       
        <FlatList
          showsVerticalScrollIndicator={false}
          data={tasks}
          keyExtractor={item => item.id}
          renderItem={renderTaskItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            isFetching ? <ActivityIndicator size="large" /> : null
          }
        />
        {renderFAB()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#444',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fab: {
    alignSelf: 'flex-end',
    backgroundColor: '#278db5',
    borderRadius: 999,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    right: 10,
  },
  fabText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 32,
    color: '#fff',
  },
});
