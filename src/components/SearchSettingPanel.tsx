import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import SortMenu from './SortMenu';

interface SearchSettingPanelProps {
  setSort: (sort: string) => void;
}

const SearchSettingPanel = ({ setSort }: SearchSettingPanelProps) => {
  const [searchText, setSearchText] = useState<string>('');
  return (
    <View>
      <View style={styles.searchPanel}>
        <View style={styles.inputBlock}>
          <View style={styles.row}>
            <TouchableOpacity>
              <Image
                source={require('../assets/icons/search.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
              style={styles.titleInput}
              placeholder="Search"
            />
          </View>
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchText('');
              }}
            >
              <Image
                source={require('../assets/icons/cancel.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          )}
        </View>
        <SortMenu setSort={setSort} />
      </View>
    </View>
  );
};

export default SearchSettingPanel;

const styles = StyleSheet.create({
  searchPanel: {
    paddingHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 12,
  },
  row: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    columnGap: 6,

    alignItems: 'center',
  },
  icon: { tintColor: '#999', width: 16, height: 16 },
  inputBlock: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    columnGap: 6,

    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fffff02f',
  },
  titleInput: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#444',
  },
});
