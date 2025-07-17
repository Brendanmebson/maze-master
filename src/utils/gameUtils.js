export const calculateScore = (moves, timeSeconds, levelNumber) => {
  const baseMoves = Math.max(10, levelNumber * 2);
  const movesPenalty = Math.max(0, moves - baseMoves);
  const timePenalty = Math.max(0, timeSeconds - 60);

  return Math.max(100, 1000 - movesPenalty * 10 - timePenalty);
};

export const getComplexityColor = (complexity) => {
  switch (complexity) {
    case 'easy':
      return '#32CD32';
    case 'medium':
      return '#FFA500';
    case 'hard':
      return '#FF4500';
    case 'expert':
      return '#8B0000';
    default:
      return '#666';
  }
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const getEnemyDescription = (enemyType) => {
  switch (enemyType) {
    case 'chaser':
      return 'Chases the player directly';
    case 'blocker':
      return 'Tries to block the exit';
    case 'teleporter':
      return 'Randomly teleports around the maze';
    case 'boss':
      return 'Powerful enemy with special abilities';
    default:
      return 'Unknown enemy type';
  }
};

export const getPowerUpDescription = (powerUpType) => {
  switch (powerUpType) {
    case 'invisibility':
      return 'Become invisible to enemies for 10 moves';
    case 'speedBoost':
      return 'Move twice in one turn for 5 moves';
    case 'freezeTime':
      return 'Freeze all enemies for 3 moves';
    default:
      return 'Unknown power-up';
  }
};
