import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider, createTheme } from '@rneui/themed';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const Stack = createNativeStackNavigator();
  const theme = createTheme({
    lightColors: {
      primary: '#010d80',
      lightBackground: '#ccc',
    },
    darkColors: {
      primary: '#000',
    },
    components: {
      Button: (props, theme) => ({
        buttonStyle: {
          borderRadius: 5,
        },
      }),
      Input: (props, theme) => ({
        inputContainerStyle: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.lightBackground,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 5,
        },
        containerStyle: {
          width: 250,
        },
      }),
    },
    mode: 'light',
  });

  const navigatorOptions = {
    headerShown: false,
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={navigatorOptions}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Ensky Login' }} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}