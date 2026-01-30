import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { TaskListScreen } from '../screens/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen';

export type RootStackParamList = {
  TaskList: undefined;
  TaskForm: { taskId?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="TaskList"
      >
        <Stack.Screen
          name="TaskList"
          component={TaskListScreen}
          options={{ title: 'Tasks' }}
        />
        <Stack.Screen
          name="TaskForm"
          component={TaskFormScreen}
          options={{ title: 'Task Form' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
