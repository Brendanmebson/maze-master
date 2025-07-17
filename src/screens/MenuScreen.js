import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';

export default function MenuScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { state, saveGameData } = useGame();

  useEffect(() => {
    saveGameData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>🔍 Maze Master</Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>
            Welcome, {user?.email || 'Guest'}!
          </Text>
          <Text style={styles.progressText}>
            Level {state.currentLevel} • {state.unlockedLevels} levels unlocked
          </Text>
        </View>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.playerStats.levelsCompleted}</Text>
            <Text style={styles.statLabel}>Levels Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.playerStats.totalMoves}</Text>
            <Text style={styles.statLabel}>Total Moves</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{state.playerStats.powerUpsCollected}</Text>
            <Text style={styles.statLabel}>Power-ups Found</Text>
          </View>
        </View>
        
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Game', { level: state.currentLevel })}
          >
            <Text style={styles.menuButtonText}>Continue Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('LevelSelect')}
          >
            <Text style={styles.menuButtonText}>Level Select</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate('Game', { level: 1 })}
          >
            <Text style={styles.menuButtonText}>New Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.menuButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.menuButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressText: {
    color: '#ccc',
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#007AFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  menu: {
    width: '100%',
  },
  menuButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});