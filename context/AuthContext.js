import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../api';
import * as LocalAuthentication from 'expo-local-authentication';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
          const auth = await LocalAuthentication.authenticateAsync();
          if (auth.success) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        setIsAuthenticated(true);
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
      } else {
        setIsAuthenticated(false);
        throw new Error('Invalid login credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('isAuthenticated');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const isLoggedIn = async () => {
    return isAuthenticated;
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};