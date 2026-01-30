import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import type { PriorityTask } from '../features/tasks/types';

const PRIORITY_LABELS: { [K in PriorityTask]: string } = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

type PriorityMenuProps = {
  selectedPriority: PriorityTask;
  onSelect: (priority: PriorityTask) => void;
};

const PriorityMenu: React.FC<PriorityMenuProps> = ({
  selectedPriority,
  onSelect,
}) => {
  return (
    <Menu style={styles.menu}>
      <MenuTrigger
        customStyles={{
          triggerText: styles.triggerText,
        }}
        text={PRIORITY_LABELS[selectedPriority]}
      />
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
          <MenuOption
            key={value}
            onSelect={() => onSelect(value as PriorityTask)}
            customStyles={{
              optionText: styles.optionText,
            }}
            text={label}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default PriorityMenu;

const styles = StyleSheet.create({
  menu: {
    padding: 6,
  },
  triggerText: {
    color: '#278db5',
    fontSize: 16,
    fontWeight: '400',
  },
  optionsContainer: {
    overflow: 'hidden',
    padding: 6,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  optionText: {
    color: '#fff',
  },
});
