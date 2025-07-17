import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

export default function GameHUD({ level, moves, onPause, activePowerUps }) {
  const formatPowerUpTime = (time) => {
    return time > 0 ? `${time}` : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hudContainer}>
        <View style={styles.leftSection}>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.movesText}>Moves: {moves}</Text>
        </View>
        
        <View style={styles.centerSection}>
          {activePowerUps.invisibility > 0 && (
            <View style={styles.powerUpIndicator}>
              <Text style={styles.powerUpText}>
                👻 {formatPowerUpTime(activePowerUps.invisibility)}
              </Text>
            </View>
          )}
          {activePowerUps.speedBoost > 0 && (
            <View style={styles.powerUpIndicator}>
              <Text style={styles.powerUpText}>
                ⚡ {formatPowerUpTime(activePowerUps.speedBoost)}
              </Text>
            </View>
          )}
          {activePowerUps.freezeTime > 0 && (
            <View style={styles.powerUpIndicator}>
              <Text style={styles.powerUpText}>
                ❄️ {formatPowerUpTime(activePowerUps.freezeTime)}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
            <Text style={styles.pauseText}>⏸️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
  },
  hudContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftSection: {
    flex: 1,
  },
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  levelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  movesText: {
    color: '#ccc',
    fontSize: 12,
  },
  powerUpIndicator: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  powerUpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pauseButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pauseText: {
    fontSize: 16,
  },
});
