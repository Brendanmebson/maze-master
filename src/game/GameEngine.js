export class GameEngine {
  constructor(levelData) {
    this.levelData = levelData;
    this.player = { ...levelData.player };
    this.enemies = levelData.enemies ? [...levelData.enemies] : [];
    this.gameState = 'playing';
    this.moveCount = 0;
    this.activePowerUps = {};
  }

  movePlayer(newX, newY) {
    if (!this.isValidMove(newX, newY)) {
      return false;
    }

    this.player.x = newX;
    this.player.y = newY;
    this.moveCount++;

// Check for collectibles
    this.checkCollectibles();

// Move enemies after player
    this.moveEnemies();

// Check win/lose conditions
    this.checkGameState();

    return true;
  }

  isValidMove(x, y) {
// Check bounds
    if (x < 0 || x >= this.levelData.width || y < 0 || y >= this.levelData.height) {
      return false;
    }

// Check walls
    const tile = this.levelData.tiles[y][x];
    if (tile === 'wall') return false;

// Check doors and keys
    if (tile === 'door' && !this.hasKey()) return false;

    return true;
  }

  moveEnemies() {
    this.enemies.forEach(enemy => {
      if (enemy.type === 'chaser') {
        this.moveChaserEnemy(enemy);
      } else if (enemy.type === 'blocker') {
        this.moveBlockerEnemy(enemy);
      } else if (enemy.type === 'teleporter') {
        this.moveTeleporterEnemy(enemy);
      }
    });
  }

  moveChaserEnemy(enemy) {
    const dx = Math.sign(this.player.x - enemy.x);
    const dy = Math.sign(this.player.y - enemy.y);

// Try to move towards player
    if (dx !== 0 && this.isValidEnemyMove(enemy.x + dx, enemy.y)) {
      enemy.x += dx;
    } else if (dy !== 0 && this.isValidEnemyMove(enemy.x, enemy.y + dy)) {
      enemy.y += dy;
    }
  }

  moveBlockerEnemy(enemy) {
// Blockers try to stay between player and exit
    const exit = this.levelData.exit;
    const midX = Math.floor((this.player.x + exit.x) / 2);
    const midY = Math.floor((this.player.y + exit.y) / 2);

    const dx = Math.sign(midX - enemy.x);
    const dy = Math.sign(midY - enemy.y);

    if (dx !== 0 && this.isValidEnemyMove(enemy.x + dx, enemy.y)) {
      enemy.x += dx;
    } else if (dy !== 0 && this.isValidEnemyMove(enemy.x, enemy.y + dy)) {
      enemy.y += dy;
    }
  }

  moveTeleporterEnemy(enemy) {
// Teleporters occasionally teleport to random valid positions
    if (Math.random() < 0.3) {
      const validPositions = this.getValidPositions();
      if (validPositions.length > 0) {
        const randomPos = validPositions[Math.floor(Math.random() * validPositions.length)];
        enemy.x = randomPos.x;
        enemy.y = randomPos.y;
      }
    }
  }

  isValidEnemyMove(x, y) {
    if (x < 0 || x >= this.levelData.width || y < 0 || y >= this.levelData.height) {
      return false;
    }

    const tile = this.levelData.tiles[y][x];
    return tile !== 'wall' && tile !== 'door';
  }

  getValidPositions() {
    const positions = [];
    for (let y = 0; y < this.levelData.height; y++) {
      for (let x = 0; x < this.levelData.width; x++) {
        if (this.isValidEnemyMove(x, y)) {
          positions.push({ x, y });
        }
      }
    }
    return positions;
  }

  checkCollectibles() {
    const tile = this.levelData.tiles[this.player.y][this.player.x];

    if (tile === 'key') {
      this.player.hasKey = true;
      this.levelData.tiles[this.player.y][this.player.x] = 'floor';
    } else if (tile === 'powerup') {
      this.collectPowerUp();
      this.levelData.tiles[this.player.y][this.player.x] = 'floor';
    }
  }

  collectPowerUp() {
    const powerUpTypes = ['invisibility', 'speedBoost', 'freezeTime'];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    return randomType;
  }

  checkGameState() {
// Check if player reached exit
    if (this.player.x === this.levelData.exit.x && this.player.y === this.levelData.exit.y) {
      this.gameState = 'victory';
      return;
    }

// Check if player touched enemy
    const touchedEnemy = this.enemies.find(enemy =>
      enemy.x === this.player.x && enemy.y === this.player.y
    );

    if (touchedEnemy && !this.activePowerUps.invisibility) {
      this.gameState = 'gameOver';
    }
  }

  hasKey() {
    return this.player.hasKey || false;
  }

  usePowerUp(type) {
    if (type === 'invisibility') {
      this.activePowerUps.invisibility = 10;// 10 moves
    } else if (type === 'speedBoost') {
      this.activePowerUps.speedBoost = 5;// 5 moves
    } else if (type === 'freezeTime') {
      this.activePowerUps.freezeTime = 3;// 3 moves
    }
  }

  updatePowerUps() {
    Object.keys(this.activePowerUps).forEach(key => {
      if (this.activePowerUps[key] > 0) {
        this.activePowerUps[key]--;
      }
    });
  }

  getGameState() {
    return {
      player: this.player,
      enemies: this.enemies,
      gameState: this.gameState,
      moveCount: this.moveCount,
      activePowerUps: this.activePowerUps,
      levelData: this.levelData,
    };
  }
}
