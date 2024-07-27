import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Image, Input, Button } from '@rneui/themed';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  const hasStoredCredentials = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');

    return storedEmail && storedPassword;
  };

  const checkStoredCredentials = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      if (hasStoredCredentials()) {
        const auth = await LocalAuthentication.authenticateAsync();
        if (auth.success) {
          await login(storedEmail, storedPassword);
          navigation.navigate("Home");
        }
      }
    } catch (error) {
      console.error('Error checking stored credentials:', error);
      logout();
    }
  };

  const authenticate = async () => {
    try {
      await login(email, password);
      const auth = await LocalAuthentication.authenticateAsync();
      if (auth.success) {
        navigation.navigate("Home");
      } else {
        Alert.alert('Invalid Face ID, please try again.');
      }
    } catch (error) {
      Alert.alert('Invalid email or password, please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.screen}>
          <Image source={require('../assets/ensky_logo.png')} style={styles.logo} />
          <Input placeholder='Email' onChangeText={setEmail} autoCapitalize='none' />
          <Input placeholder='Password' onChangeText={setPassword} secureTextEntry={true} autoCapitalize='none' />
          <Button style={styles.button} title='Login' onPress={authenticate}></Button>
          <Button style={styles.button} title='Login with biometrics' onPress={checkStoredCredentials}></Button>


        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 20,
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  button: {
    marginTop: 20,
  },
});