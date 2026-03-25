import { entityLayer, map } from "../world/map.js";
import * as c from "../game/config.js";

import * as utils from "../game/utils.js";

import { player } from "./player.js";
import { endGame } from "../game/state.js";

export let enemiesRouter = {
  enemies: [],

  init: initEnemies,
  update: updateEnemies,
  animate: animateEnemies,

  remove: removeEnemies,
  reset: resetEnemies,
};

function initEnemies() {
  let candidates = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (
        !(row <= 2 && col <= 2) &&
        map[row][col] !== 1 &&
        map[row][col] !== 2
      ) {
        candidates.push([row, col]);
      }
    }
  }

  utils.shuffle(candidates);

  for (let i = 0; i < Math.min(c.ENEMIES_NUMBER, candidates.length); i++) {
    let row = candidates[i][0];
    let col = candidates[i][1];

    let enemy = document.createElement("div");

    enemy.classList = "enemy";

    enemy.style.transform = `
    translate(${col * c.CELL_SIZE}px, ${row * c.CELL_SIZE}px)
    `;

    entityLayer.appendChild(enemy);

    enemiesRouter.enemies.push({
      row: row,
      col: col,
      targetRow: row,
      targetCol: col,

      posY: row * c.CELL_SIZE,
      posX: col * c.CELL_SIZE,
      dir: "R",

      elem: enemy,

      frame: 1,
      frameProg: 0,
    });
  }
}

function isSafeNextCell(row, col) {
  if (row > map.length - 1 || col > map[0].length - 1) {
    return false;
  }
  if (row < 0 || col < 0) {
    return false;
  }
  let cell = map[row][col];
  return cell !== 1 && cell !== 2;
}

let canMove = {
  R: (enemy) => {
    return isSafeNextCell(enemy.row, enemy.col + 1);
  },
  L: (enemy) => {
    return isSafeNextCell(enemy.row, enemy.col - 1);
  },
  U: (enemy) => {
    return isSafeNextCell(enemy.row - 1, enemy.col);
  },
  D: (enemy) => {
    return isSafeNextCell(enemy.row + 1, enemy.col);
  },
};

function getNextMoveDir(enemy, directions = ["R", "L", "U", "D"]) {
  let oppDirs = {
    R: "L",
    L: "R",
    U: "D",
    D: "U",
  };

  let validDirs = directions.filter((dir) => canMove[dir](enemy));

  if (validDirs.length === 0) {
    return;
  }

  let forwardDirs = validDirs.filter((dir) => dir !== oppDirs[enemy.dir]);

  if (forwardDirs.length === 0) forwardDirs = validDirs;

  utils.shuffle(forwardDirs);

  return forwardDirs[0];
}

function updatePixelPos(enemy, dt) {
  if (!enemy.dir) return;

  if (enemy.dir === "R") enemy.posX += c.ENEMY_SPEED * dt;
  if (enemy.dir === "L") enemy.posX -= c.ENEMY_SPEED * dt;
  if (enemy.dir === "U") enemy.posY -= c.ENEMY_SPEED * dt;
  if (enemy.dir === "D") enemy.posY += c.ENEMY_SPEED * dt;
}

function updateEnemyGridPos(enemy) {
  enemy.row = enemy.targetRow;
  enemy.col = enemy.targetCol;

  enemy.dir = getNextMoveDir(enemy);

  if (enemy.dir === "R") enemy.targetCol = enemy.col + 1;
  if (enemy.dir === "L") enemy.targetCol = enemy.col - 1;
  if (enemy.dir === "U") enemy.targetRow = enemy.row - 1;
  if (enemy.dir === "D") enemy.targetRow = enemy.row + 1;
}

function reachedTarget(enemy) {
  return (
    (enemy.dir === "R" && enemy.posX >= enemy.targetCol * c.CELL_SIZE) ||
    (enemy.dir === "L" && enemy.posX <= enemy.targetCol * c.CELL_SIZE) ||
    (enemy.dir === "U" && enemy.posY <= enemy.targetRow * c.CELL_SIZE) ||
    (enemy.dir === "D" && enemy.posY >= enemy.targetRow * c.CELL_SIZE)
  );
}

function updateEnemies(dt) {
  enemiesRouter.enemies.forEach((enemy) => {
    //

    if (!enemy.dir) enemy.dir = getNextMoveDir(enemy);

    if (reachedTarget(enemy)) {
      enemy.posX = enemy.targetCol * c.CELL_SIZE;
      enemy.posY = enemy.targetRow * c.CELL_SIZE;

      updateEnemyGridPos(enemy);
      enemy.frameProg = 0;
    }

    updatePixelPos(enemy, dt);

    if (player.row === enemy.row && player.col === enemy.col) {
      player.damage();
    }

    utils.updateFrame(enemy);
  });
}

function animateEnemies() {
  enemiesRouter.enemies.forEach((enemy) => {
    enemy.elem.style.transform = `translate(${enemy.posX}px, ${enemy.posY}px)`;

    utils.animateFrame(enemy);
  });
}

function removeEnemies(firesPos) {
  enemiesRouter.enemies = enemiesRouter.enemies.filter((enemy) => {
    let enemyPos = `${enemy.row} ${enemy.col}`;

    if (enemyPos in firesPos) {
      enemy.elem.remove();
      player.score += c.ENEMIES_SCORE;
      return false;
    }

    return true;
  });

  if (enemiesRouter.enemies.length === 0) {
    endGame("YOU WIN! All enemies defeated!");
  }
}

function resetEnemies() {
  enemiesRouter.enemies.forEach((enemy) => {
    enemy.elem.remove();
  });

  enemiesRouter.enemies = [];
}
