import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Task } from '../features/tasks/types';
interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
}
const TaskItem = ({ task, onDelete }: TaskItemProps) => {
  return (
    <View
      style={{
        marginVertical: 10,
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#222',
      }}
    >
      <Text>{task.title}</Text>
      <Text>{task.description}</Text>
      <Text>{task.priority}</Text>
      <Text>{task.completed}</Text>
      <Text>{task.deadline}</Text>
    </View>
  );
};

export default TaskItem;

const styles = StyleSheet.create({});
// id: '1',
// title: 'Example Task',
// description: 'This is an example task',
// completed: false,
// priority: 'medium',
// deadline: '2023-12-31T23:59:59Z',
// categoryId: 'cat123',
// updatedAt: Date.now(),
// };
