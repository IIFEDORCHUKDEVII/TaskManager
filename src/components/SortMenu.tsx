import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import { SORT_CONFIG } from '../utils/sortConfig';
import { TaskSort } from '../features/tasks/types';
// Date of creation
interface SortMenuProps {
  setSort: (sort: string) => void;
}
const SortMenu = ({ setSort }: SortMenuProps) => {
  return (
    <Menu>
      <MenuTrigger
        children={
          <Image
            source={require('../assets/icons/filter.png')}
            style={styles.icon}
          />
        }
      ></MenuTrigger>
      <MenuOptions customStyles={{ optionsContainer: styles.optionsContainer }}>
        {Object.values(SORT_CONFIG).map(sort => (
          <MenuOption
            onSelect={() => {
              setSort(sort.field + '_' + sort.direction);
            }}
            key={sort.field}
            customStyles={{
              optionText: styles.optionText,
            }}
            text={sort.label}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default SortMenu;

const styles = StyleSheet.create({
  icon: { tintColor: '#999', width: 16, height: 16 },
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
