import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Task } from '../features/tasks/types';

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const PRIORITY_LABELS: Record<number, string> = {
  1: '!',
  2: '!!',
  3: '!!!',
};

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => (
  <View style={styles.container}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        columnGap: 12,
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onUpdate({ ...task, completed: !task.completed });
        }}
      >
        <Image
          style={{ height: 24, width: 24, tintColor: '#455' }}
          source={
            task.completed
              ? require('../assets/icons/check.png')
              : require('../assets/icons/uncheck.png')
          }
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>
          <Text style={styles.priority}>{PRIORITY_LABELS[task.priority]}</Text>{' '}
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        <Text style={styles.deadline}>
          {new Date(task.deadline).toDateString()}
        </Text>
      </View>
    </View>
  </View>
);

export default TaskItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#222',
  },
  title: {
    color: '#999',
  },
  priority: {
    fontSize: 18,
    color: '#999',
  },
  description: {
    color: '#999',
  },
  deadline: {
    color: '#999',
  },
});
