import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

const initialState = {
  currentLevel: 1,
  unlockedLevels: 1,
  playerStats: {
    totalMoves: 0,
    levelsCompleted: 0,
    powerUpsCollected: 0,
  },
  powerUps: {
    invisibility: 0,
    speedBoost: 0,
    freezeTime: 0,
  },
  gameState: 'menu',// menu, playing, paused, gameOver, victory
  levelData: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LEVEL':
      return { ...state, currentLevel: action.payload };
    case 'UNLOCK_LEVEL':
      return {
        ...state,
        unlockedLevels: Math.max(state.unlockedLevels, action.payload)
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        playerStats: { ...state.playerStats, ...action.payload }
      };
    case 'ADD_POWERUP':
      return {
        ...state,
        powerUps: {
          ...state.powerUps,
          [action.payload.type]: state.powerUps[action.payload.type] + action.payload.amount
        }
      };
    case 'USE_POWERUP':
      return {
        ...state,
        powerUps: {
          ...state.powerUps,
          [action.payload]: Math.max(0, state.powerUps[action.payload] - 1)
        }
      };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_LEVEL_DATA':
      return { ...state, levelData: action.payload };
    case 'LOAD_SAVE_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    loadSaveData();
  }, []);

  const loadSaveData = async () => {
    try {
      const saveData = await AsyncStorage.getItem('mazegame_save');
      if (saveData) {
        dispatch({ type: 'LOAD_SAVE_DATA', payload: JSON.parse(saveData) });
      }
    } catch (error) {
      console.error('Error loading save data:', error);
    }
  };

  const saveGameData = async () => {
    try {
      await AsyncStorage.setItem('mazegame_save', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving game data:', error);
    }
  };

  const value = {
    state,
    dispatch,
    saveGameData,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
