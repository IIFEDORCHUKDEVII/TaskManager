import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAddTaskMutation } from '../features/tasks/tasksApi';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import PriorityMenu from '../components/PriorityMenu';
import DateTimePicker from '@react-native-community/datetimepicker';

import { PriorityTask } from '../features/tasks/types';
type TaskFormNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'TaskForm'
>;

const INITIAL_DATE = new Date();
const priorityOrderMap = {
  low: 1,
  medium: 2,
  high: 3,
};

const TaskFormScreen: React.FC = () => {
  const navigation = useNavigation<TaskFormNavProp>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityTask>('medium');
  const [addTask] = useAddTaskMutation();

  const [date, setDate] = useState<Date>(INITIAL_DATE);
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);
  const [switchStates, setSwitchStates] = useState<{
    date: boolean;
    time: boolean;
  }>({ date: false, time: false });

  const handleDateTimeChange = useCallback(
    (_event: any, selectedDate?: Date) => {
      const currentDate = selectedDate;
      setShow(false);
      console.log(_event, currentDate);

      if (currentDate) setDate(currentDate);
    },
    [],
  );

  const handleShowMode = useCallback(
    (currentMode: 'date' | 'time') => {
      setMode(currentMode);

      setShow(!switchStates[currentMode]);
    },
    [switchStates],
  );

  const handleDateSwitch = useCallback(() => {
    setSwitchStates(prev => {
      const nextState = { ...prev, date: !prev.date };
      // If turning off date, also disable time.
      if (!nextState.date) nextState.time = false;
      return nextState;
    });
    handleShowMode('date');
  }, [handleShowMode]);

  const handleTimeSwitch = useCallback(() => {
    setSwitchStates(prev => ({ ...prev, time: !prev.time }));
    handleShowMode('time');
  }, [handleShowMode]);
  useEffect(() => {
    if (show)
      DateTimePickerAndroid.open({
        minimumDate: INITIAL_DATE,
        value: date,
        onChange: handleDateTimeChange,
        mode: mode,
        is24Hour: true,
      });
    return () => {};
  }, [show]);

  const handleSave = useCallback(() => {
    addTask({
      id: Date.now().toString(),
      title,
      description,
      completed: false,
      priority: priorityOrderMap[priority],
      deadline: date.toISOString(),
      createdAt: Date.now(),
      category: 'cat123',
      updatedAt: Date.now(),
    });
    navigation.goBack();
  }, [addTask, title, description, priority, date, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Details</Text>
      <View style={styles.flexContainer}>
        <View style={styles.formBlock}>
          <View style={styles.inputBlock}>
            <TextInput
              placeholder="Title"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              style={[styles.textInput, styles.titleInput]}
            />
            <TextInput
              multiline
              numberOfLines={5}
              placeholder="Description"
              placeholderTextColor="#999"
              value={description}
              style={[styles.textInput, styles.descriptionInput]}
              onChangeText={setDescription}
            />
          </View>
          <View style={styles.inputBlock}>
            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Switch
                onChange={handleDateSwitch}
                value={switchStates.date}
                thumbColor="#fff"
                trackColor={{ true: 'green' }}
              />
            </View>
            {switchStates.date && (
              <Text style={styles.valueText}>{date.toDateString()}</Text>
            )}
            <View style={[styles.row, styles.dividerRow]}>
              <Text style={styles.label}>Time</Text>
              <Switch
                onChange={handleTimeSwitch}
                value={switchStates.time}
                thumbColor="#fff"
                trackColor={{ true: 'green' }}
                disabled={!switchStates.date}
              />
            </View>
            {switchStates.date && switchStates.time && (
              <Text style={styles.valueText}>
                {date.toLocaleTimeString('en', {
                  hour: '2-digit',
                  minute: 'numeric',
                })}
              </Text>
            )}
          </View>
          <View style={styles.inputBlock}>
            <View style={styles.row}>
              <Text style={styles.label}>Priority</Text>
              <PriorityMenu
                selectedPriority={priority}
                onSelect={setPriority}
              />
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.btn} onPress={handleSave}>
            <Text style={[styles.titleInput, { color: '#fff' }]}>
              Save Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TaskFormScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 42,
    paddingHorizontal: 16,
    backgroundColor: '#444',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    paddingBottom: 16,
  },
  formBlock: {
    flex: 1,
    rowGap: 12,
  },
  row: {
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dividerRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#444',
  },
  inputBlock: {
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#222',
  },
  textInput: {
    color: '#fff',
    fontWeight: '400',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '500',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
  descriptionInput: {
    maxHeight: 70,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '400',
  },
  valueText: {
    color: '#278db5',
    paddingBottom: 6,
  },
  btn: {
    backgroundColor: '#278db5',
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 16,
  },
});
