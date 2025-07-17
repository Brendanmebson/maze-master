import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import AuthScreen from './src/screens/AuthScreen';
import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import { AuthProvider } from './src/context/AuthContext';
import { GameProvider } from './src/context/GameContext';

const firebaseConfig = {
  apiKey: "AIzaSyBhVeJJYE88opPBaWxW2tzjyGVN6ukG8ZA",
  authDomain: "maze-master-debdd.firebaseapp.com",
  projectId: "maze-master-debdd",
  storageBucket: "maze-master-debdd.firebasestorage.app",
  messagingSenderId: "618352825680",
  appId: "1:618352825680:web:fe7f112a13957d09748855",
  measurementId: "G-CEFBZTGQPH"
};

const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
            <Stack.Screen name="Game" component={GameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AuthProvider>
  );
}
