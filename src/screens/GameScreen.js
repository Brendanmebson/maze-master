import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { GameEngine } from '../game/GameEngine';
import { LevelGenerator } from '../game/LevelGenerator';
import GameBoard from '../components/GameBoard';
import GameHUD from '../components/GameHUD';
import PowerUpPanel from '../components/PowerUpPanel';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation, route }) {
  const { state, dispatch } = useGame();
  const { user } = useAuth();
  const [gameEngine, setGameEngine] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [sounds, setSounds] = useState({});

  const levelNumber = route.params?.level || state.currentLevel;

  useEffect(() => {
    initializeLevel();
    loadSounds();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
// Cleanup sounds
      Object.values(sounds).forEach(sound => {
        sound.unloadAsync();
      });
    };
  }, [levelNumber]);

  const loadSounds = async () => {
    try {
      const moveSound = await Audio.Sound.createAsync(
        require('../assets/sounds/move.wav'),
        { shouldPlay: false }
      );
      const winSound = await Audio.Sound.createAsync(
        require('../assets/sounds/win.wav'),
        { shouldPlay: false }
      );
      const loseSound = await Audio.Sound.createAsync(
        require('../assets/sounds/lose.wav'),
        { shouldPlay: false }
      );

      setSounds({
        move: moveSound.sound,
        win: winSound.sound,
        lose: loseSound.sound,
      });
    } catch (error) {
      console.error('Error loading sounds:', error);
    }
  };

  const initializeLevel = () => {
    const levelData = LevelGenerator.generateLevel(levelNumber);
    const engine = new GameEngine(levelData);

    setGameEngine(engine);
    setGameState(engine.getGameState());
    setIsLoading(false);

    dispatch({ type: 'SET_LEVEL', payload: levelNumber });
    dispatch({ type: 'SET_LEVEL_DATA', payload: levelData });
  };

  const handleTilePress = (x, y) => {
    if (!gameEngine || gameState.gameState !== 'playing') return;

    const moved = gameEngine.movePlayer(x, y);

    if (moved) {
      playSound('move');
      const newState = gameEngine.getGameState();
      setGameState(newState);

// Update power-ups
      gameEngine.updatePowerUps();

// Check game end conditions
      if (newState.gameState === 'victory') {
        handleLevelComplete();
      } else if (newState.gameState === 'gameOver') {
        handleGameOver();
      }
    }
  };

  const handleLevelComplete = () => {
    playSound('win');

// Update stats
    dispatch({
      type: 'UPDATE_STATS',
      payload: {
        levelsCompleted: state.playerStats.levelsCompleted + 1,
        totalMoves: state.playerStats.totalMoves + gameState.moveCount,
      }
    });

// Unlock next level
    dispatch({ type: 'UNLOCK_LEVEL', payload: levelNumber + 1 });

    Alert.alert(
      'Level Complete!',
      `You completed level ${levelNumber} in ${gameState.moveCount} moves!`,
      [
        { text: 'Next Level', onPress: () => goToNextLevel() },
        { text: 'Level Select', onPress: () => navigation.navigate('LevelSelect') },
      ]
    );
  };

  const handleGameOver = () => {
    playSound('lose');

    Alert.alert(
      'Game Over',
      'You were caught by an enemy!',
      [
        { text: 'Retry', onPress: () => initializeLevel() },
        { text: 'Level Select', onPress: () => navigation.navigate('LevelSelect') },
      ]
    );
  };

  const goToNextLevel = () => {
    if (levelNumber < 200) {
      navigation.push('Game', { level: levelNumber + 1 });
    } else {
      Alert.alert('Congratulations!', 'You completed all levels!');
      navigation.navigate('Menu');
    }
  };

  const playSound = async (soundName) => {
    if (sounds[soundName]) {
      try {
        await sounds[soundName].replayAsync();
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  const usePowerUp = (powerUpType) => {
    if (state.powerUps[powerUpType] > 0) {
      gameEngine.usePowerUp(powerUpType);
      dispatch({ type: 'USE_POWERUP', payload: powerUpType });
      setGameState(gameEngine.getGameState());
    }
  };

  const pauseGame = () => {
    Alert.alert(
      'Game Paused',
      'What would you like to do?',
      [
        { text: 'Resume', style: 'default' },
        { text: 'Restart Level', onPress: () => initializeLevel() },
        { text: 'Exit to Menu', onPress: () => navigation.navigate('Menu') },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Level {levelNumber}...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <GameHUD
        level={levelNumber}
        moves={gameState.moveCount}
        onPause={pauseGame}
        activePowerUps={gameState.activePowerUps}
      />

      <GameBoard
        gameState={gameState}
        onTilePress={handleTilePress}
        screenWidth={width}
        screenHeight={height * 0.7}
      />

      <PowerUpPanel
        powerUps={state.powerUps}
        onUsePowerUp={usePowerUp}
        disabled={gameState.gameState !== 'playing'}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
