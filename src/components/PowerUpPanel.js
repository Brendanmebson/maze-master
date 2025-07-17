import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function PowerUpPanel({ powerUps, onUsePowerUp, disabled }) {
  const powerUpData = [
    {
      type: 'invisibility',
      emoji: '👻',
      name: 'Invisibility',
      description: 'Invisible to enemies for 10 moves',
    },
    {
      type: 'speedBoost',
      emoji: '⚡',
      name: 'Speed Boost',
      description: 'Move twice for 5 turns',
    },
    {
      type: 'freezeTime',
      emoji: '❄️',
      name: 'Freeze Time',
      description: 'Enemies frozen for 3 moves',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.title}>Power-Ups</Text>
        <View style={styles.powerUpGrid}>
          {powerUpData.map((powerUp) => (
            <TouchableOpacity
              key={powerUp.type}
              style={[
                styles.powerUpButton,
                powerUps[powerUp.type] === 0 && styles.disabledButton,
                disabled && styles.disabledButton,
              ]}
              onPress={() => onUsePowerUp(powerUp.type)}
              disabled={disabled || powerUps[powerUp.type] === 0}
            >
              <Text style={styles.powerUpEmoji}>{powerUp.emoji}</Text>
              <Text style={styles.powerUpCount}>{powerUps[powerUp.type]}</Text>
              <Text style={styles.powerUpName}>{powerUp.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
  },
  panel: {
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  powerUpGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  powerUpButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  disabledButton: {
    backgroundColor: '#222',
    opacity: 0.5,
  },
  powerUpEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },
  powerUpCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  powerUpName: {
    color: '#ccc',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});