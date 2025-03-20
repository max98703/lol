import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AppNavigator from './src/navigators/AppNavigator';
import { AuthenticatedUserProvider } from './src/context/AuthenticatedUserContext';
import { NotificationProvider } from './src/context/NotificationContext';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AuthenticatedUserProvider>
      <NotificationProvider>
        <AppNavigator />
      </NotificationProvider>
    </AuthenticatedUserProvider>
  );
};

export default App;