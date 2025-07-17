import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export default function GameBoard({ gameState, onTilePress, screenWidth, screenHeight }) {
  const animatedValues = useRef({});
  
  if (!gameState || !gameState.levelData) return null;
  
  const { levelData, player, enemies } = gameState;
  const { width, height, tiles } = levelData;
  
  const tileSize = Math.min(
    (screenWidth - 40) / width,
    (screenHeight - 40) / height
  );
  
  const boardWidth = width * tileSize;
  const boardHeight = height * tileSize;

  useEffect(() => {
    // Initialize animations for entities
    if (!animatedValues.current.player) {
      animatedValues.current.player = {
        x: new Animated.Value(player.x * tileSize),
        y: new Animated.Value(player.y * tileSize),
      };
    }

    enemies.forEach((enemy, index) => {
      if (!animatedValues.current[`enemy_${index}`]) {
        animatedValues.current[`enemy_${index}`] = {
          x: new Animated.Value(enemy.x * tileSize),
          y: new Animated.Value(enemy.y * tileSize),
        };
      }
    });

    // Animate player movement
    Animated.parallel([
      Animated.timing(animatedValues.current.player.x, {
        toValue: player.x * tileSize,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(animatedValues.current.player.y, {
        toValue: player.y * tileSize,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate enemy movements
    enemies.forEach((enemy, index) => {
      const enemyAnim = animatedValues.current[`enemy_${index}`];
      if (enemyAnim) {
        Animated.parallel([
          Animated.timing(enemyAnim.x, {
            toValue: enemy.x * tileSize,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(enemyAnim.y, {
            toValue: enemy.y * tileSize,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      }
    });
  }, [player, enemies, tileSize]);

  const renderTile = (tileType, x, y) => {
    const tileStyle = [
      styles.tile,
      {
        width: tileSize,
        height: tileSize,
        left: x * tileSize,
        top: y * tileSize,
      },
      getTileStyle(tileType),
    ];

    return (
      <TouchableOpacity
        key={`tile_${x}_${y}`}
        style={tileStyle}
        onPress={() => onTilePress(x, y)}
        activeOpacity={0.8}
      >
        {getTileContent(tileType)}
      </TouchableOpacity>
    );
  };

  const getTileStyle = (tileType) => {
    switch (tileType) {
      case 'wall':
        return styles.wallTile;
      case 'floor':
        return styles.floorTile;
      case 'door':
        return styles.doorTile;
      case 'key':
        return styles.keyTile;
      case 'powerup':
        return styles.powerUpTile;
      case 'trap':
        return styles.trapTile;
      case 'oneway':
        return styles.onewayTile;
      default:
        return styles.floorTile;
    }
  };

  const getTileContent = (tileType) => {
    switch (tileType) {
      case 'wall':
        return <View style={styles.wallContent} />;
      case 'door':
        return <View style={styles.doorContent} />;
      case 'key':
        return <View style={styles.keyContent} />;
      case 'powerup':
        return <View style={styles.powerUpContent} />;
      case 'trap':
        return <View style={styles.trapContent} />;
      case 'oneway':
        return <View style={styles.onewayContent} />;
      default:
        return null;
    }
  };

  const renderPlayer = () => {
    if (!animatedValues.current.player) return null;

    const isInvisible = gameState.activePowerUps.invisibility > 0;
    
    return (
      <Animated.View
        style={[
          styles.player,
          {
            width: tileSize * 0.8,
            height: tileSize * 0.8,
            left: animatedValues.current.player.x,
            top: animatedValues.current.player.y,
            opacity: isInvisible ? 0.5 : 1,
          },
        ]}
      >
        <View style={styles.playerContent} />
        {player.hasKey && <View style={styles.playerKey} />}
      </Animated.View>
    );
  };

  const renderEnemies = () => {
    return enemies.map((enemy, index) => {
      const enemyAnim = animatedValues.current[`enemy_${index}`];
      if (!enemyAnim) return null;

      const isFrozen = gameState.activePowerUps.freezeTime > 0;
      
      return (
        <Animated.View
          key={`enemy_${index}`}
          style={[
            styles.enemy,
            {
              width: tileSize * 0.7,
              height: tileSize * 0.7,
              left: enemyAnim.x,
              top: enemyAnim.y,
              opacity: isFrozen ? 0.5 : 1,
            },
            getEnemyStyle(enemy.type),
          ]}
        >
          <View style={[styles.enemyContent, getEnemyContentStyle(enemy.type)]} />
        </Animated.View>
      );
    });
  };

  const getEnemyStyle = (enemyType) => {
    switch (enemyType) {
      case 'chaser':
        return styles.chaserEnemy;
      case 'blocker':
        return styles.blockerEnemy;
      case 'teleporter':
        return styles.teleporterEnemy;
      case 'boss':
        return styles.bossEnemy;
      default:
        return styles.chaserEnemy;
    }
  };

  const getEnemyContentStyle = (enemyType) => {
    switch (enemyType) {
      case 'chaser':
        return styles.chaserContent;
      case 'blocker':
        return styles.blockerContent;
      case 'teleporter':
        return styles.teleporterContent;
      case 'boss':
        return styles.bossContent;
      default:
        return styles.chaserContent;
    }
  };

  const renderExit = () => {
    const { exit } = levelData;
    
    return (
      <View
        style={[
          styles.exit,
          {
            width: tileSize * 0.9,
            height: tileSize * 0.9,
            left: exit.x * tileSize + tileSize * 0.05,
            top: exit.y * tileSize + tileSize * 0.05,
          },
        ]}
      >
        <View style={styles.exitContent} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.board,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
      >
        {/* Render tiles */}
        {tiles.map((row, y) =>
          row.map((tile, x) => renderTile(tile, x, y))
        )}
        
        {/* Render exit */}
        {renderExit()}
        
        {/* Render enemies */}
        {renderEnemies()}
        
        {/* Render player */}
        {renderPlayer()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  board: {
    position: 'relative',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tile: {
    position: 'absolute',
    borderWidth: 0.5,
    borderColor: '#333',
  },
  floorTile: {
    backgroundColor: '#3a3a3a',
  },
  wallTile: {
    backgroundColor: '#555',
  },
  doorTile: {
    backgroundColor: '#8B4513',
  },
  keyTile: {
    backgroundColor: '#FFD700',
  },
  powerUpTile: {
    backgroundColor: '#00FF00',
  },
  trapTile: {
    backgroundColor: '#FF4500',
  },
  onewayTile: {
    backgroundColor: '#4169E1',
  },
  wallContent: {
    flex: 1,
    backgroundColor: '#666',
    margin: 2,
    borderRadius: 2,
  },
  doorContent: {
    flex: 1,
    backgroundColor: '#A0522D',
    margin: 2,
    borderRadius: 2,
  },
  keyContent: {
    flex: 1,
    backgroundColor: '#FFD700',
    margin: 4,
    borderRadius: 50,
  },
  powerUpContent: {
    flex: 1,
    backgroundColor: '#32CD32',
    margin: 4,
    borderRadius: 50,
  },
  trapContent: {
    flex: 1,
    backgroundColor: '#FF6347',
    margin: 3,
    borderRadius: 3,
  },
  onewayContent: {
    flex: 1,
    backgroundColor: '#4682B4',
    margin: 3,
    borderRadius: 3,
  },
  player: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  playerContent: {
    width: '80%',
    height: '80%',
    backgroundColor: '#00BFFF',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  playerKey: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  enemy: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 90,
  },
  enemyContent: {
    width: '80%',
    height: '80%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chaserEnemy: {},
  chaserContent: {
    backgroundColor: '#FF4500',
  },
  blockerEnemy: {},
  blockerContent: {
    backgroundColor: '#800080',
  },
  teleporterEnemy: {},
  teleporterContent: {
    backgroundColor: '#FF1493',
  },
  bossEnemy: {},
  bossContent: {
    backgroundColor: '#8B0000',
  },
  exit: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  exitContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#32CD32',
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#228B22',
  },
});