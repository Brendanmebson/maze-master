import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import AuthScreen from './src/screens/AuthScreen';
import GameScreen from './src/screens/GameScreen';
import MenuScreen from './src/screens/MenuScreen';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import { AuthProvider } from './src/context/AuthContext';
import { GameProvider } from './src/context/GameContext';

// Import Firebase configuration
import './src/config/firebase';

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