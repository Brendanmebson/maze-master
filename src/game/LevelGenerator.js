export class LevelGenerator {
  static generateLevel(levelNumber) {
    const complexity = this.getComplexity(levelNumber);
    const size = this.getSize(levelNumber);

    const level = {
      id: levelNumber,
      width: size.width,
      height: size.height,
      tiles: this.generateMaze(size.width, size.height),
      player: { x: 1, y: 1, hasKey: false },
      exit: { x: size.width - 2, y: size.height - 2 },
      enemies: [],
      powerUps: [],
      doors: [],
      keys: [],
      complexity,
    };

    this.addComplexityFeatures(level, complexity);
    return level;
  }

  static getComplexity(levelNumber) {
    if (levelNumber <= 10) return 'easy';
    if (levelNumber <= 50) return 'medium';
    if (levelNumber <= 100) return 'hard';
    return 'expert';
  }

  static getSize(levelNumber) {
    if (levelNumber <= 10) return { width: 8, height: 8 };
    if (levelNumber <= 50) return { width: 10, height: 10 };
    if (levelNumber <= 100) return { width: 12, height: 12 };
    return { width: 15, height: 15 };
  }

  static generateMaze(width, height) {
// Initialize with walls
    const maze = Array(height).fill().map(() => Array(width).fill('wall'));

// Create paths using recursive backtracking
    const stack = [];
    const visited = Array(height).fill().map(() => Array(width).fill(false));

// Start from (1,1)
    let current = { x: 1, y: 1 };
    maze[current.y][current.x] = 'floor';
    visited[current.y][current.x] = true;
    stack.push(current);

    while (stack.length > 0) {
      const neighbors = this.getUnvisitedNeighbors(current, visited, width, height);

      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];

// Remove wall between current and next
        const wallX = current.x + (next.x - current.x) / 2;
        const wallY = current.y + (next.y - current.y) / 2;

        maze[wallY][wallX] = 'floor';
        maze[next.y][next.x] = 'floor';
        visited[next.y][next.x] = true;

        stack.push(next);
        current = next;
      } else {
        current = stack.pop();
      }
    }

    return maze;
  }

  static getUnvisitedNeighbors(current, visited, width, height) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -2 },// up
      { x: 2, y: 0 },// right
      { x: 0, y: 2 },// down
      { x: -2, y: 0 },// left
    ];

    directions.forEach(dir => {
      const newX = current.x + dir.x;
      const newY = current.y + dir.y;

      if (newX > 0 && newX < width - 1 &&
          newY > 0 && newY < height - 1 &&
          !visited[newY][newX]) {
        neighbors.push({ x: newX, y: newY });
      }
    });

    return neighbors;
  }

  static addComplexityFeatures(level, complexity) {
    const { width, height, tiles } = level;

    if (complexity === 'medium') {
// Add doors and keys
      this.addDoorsAndKeys(level);
      this.addOneWayPaths(level);
    } else if (complexity === 'hard') {
// Add enemies
      this.addEnemies(level, 2);
      this.addDoorsAndKeys(level);
    } else if (complexity === 'expert') {
// Add multiple enemy types, power-ups, and obstacles
      this.addEnemies(level, 4);
      this.addPowerUps(level);
      this.addObstacles(level);

// Boss levels every 25 levels
      if (level.id % 25 === 0) {
        this.addBossFeatures(level);
      }
    }
  }

  static addDoorsAndKeys(level) {
    const floorTiles = this.getFloorTiles(level);

    if (floorTiles.length < 4) return;

// Add a door
    const doorPos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
    level.tiles[doorPos.y][doorPos.x] = 'door';

// Add a key
    const keyPos = floorTiles.find(tile =>
      tile.x !== doorPos.x || tile.y !== doorPos.y
    );
    if (keyPos) {
      level.tiles[keyPos.y][keyPos.x] = 'key';
    }
  }

  static addOneWayPaths(level) {
    const floorTiles = this.getFloorTiles(level);

// Add a few one-way paths
    for (let i = 0; i < 2; i++) {
      const tile = floorTiles[Math.floor(Math.random() * floorTiles.length)];
      level.tiles[tile.y][tile.x] = 'oneway';
    }
  }

  static addEnemies(level, count) {
    const floorTiles = this.getFloorTiles(level);
    const enemyTypes = ['chaser', 'blocker', 'teleporter'];

    for (let i = 0; i < Math.min(count, floorTiles.length); i++) {
      const pos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

      level.enemies.push({
        x: pos.x,
        y: pos.y,
        type,
        id: `enemy_${i}`,
      });

// Remove used position
      floorTiles.splice(floorTiles.indexOf(pos), 1);
    }
  }

  static addPowerUps(level) {
    const floorTiles = this.getFloorTiles(level);

// Add 1-3 power-ups
    const powerUpCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < Math.min(powerUpCount, floorTiles.length); i++) {
      const pos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
      level.tiles[pos.y][pos.x] = 'powerup';
    }
  }

  static addObstacles(level) {
    const floorTiles = this.getFloorTiles(level);

// Add moving walls or traps
    const obstacleCount = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < Math.min(obstacleCount, floorTiles.length); i++) {
      const pos = floorTiles[Math.floor(Math.random() * floorTiles.length)];
      level.tiles[pos.y][pos.x] = 'trap';
    }
  }

  static addBossFeatures(level) {
// Make boss levels larger and more complex
    level.enemies.push({
      x: Math.floor(level.width / 2),
      y: Math.floor(level.height / 2),
      type: 'boss',
      id: 'boss',
      health: 3,
    });
  }

  static getFloorTiles(level) {
    const floorTiles = [];

    for (let y = 0; y < level.height; y++) {
      for (let x = 0; x < level.width; x++) {
        if (level.tiles[y][x] === 'floor' &&
            !(x === level.player.x && y === level.player.y) &&
            !(x === level.exit.x && y === level.exit.y)) {
          floorTiles.push({ x, y });
        }
      }
    }

    return floorTiles;
  }
}
