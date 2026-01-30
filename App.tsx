import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import { MenuProvider } from 'react-native-popup-menu';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <MenuProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </MenuProvider>
  );
};

export default App;
