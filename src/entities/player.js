import { map, entityLayer } from "../world/map.js";
import * as c from "../game/config.js";
import * as utils from "../game/utils.js";

import { keys } from "../input/input.js";
import { endGame } from "../game/state.js";

export let player = {
  row: 1,
  col: 1,

  posX: c.CELL_SIZE,
  posY: c.CELL_SIZE,

  targetRow: 1,
  targetCol: 1,
  isMoving: false,

  frame: 0,
  frameProg: 0,
  dir: "D",

  score: 0,
  lives: 3,
  immune: false,
  immuneTimer: 0,

  elem: null,

  init: initPlayer,
  update: updatePlayer,
  animate: animatePlayer,
  damage: damagePlayer,
  reset: resetPlayer,
};

function initPlayer() {
  let p = document.createElement("div");

  p.className = "player";
  p.style.transform = `translate(${player.posX}px, ${player.posY}px)`;

  player.elem = p;

  entityLayer.appendChild(player.elem);
}

function canMoveToCell(row, col) {
  if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) {
    return false;
  }

  if (map[row][col] !== 0) {
    return false;
  }

  return true;
}

function setPlayerTarget() {
  let nextRow = player.row;
  let nextCol = player.col;
  let attemptedDir = null;

  if (keys.w || keys.ArrowUp) {
    nextRow--;
    attemptedDir = "U";
  } else if (keys.s || keys.ArrowDown) {
    nextRow++;
    attemptedDir = "D";
  } else if (keys.a || keys.ArrowLeft) {
    nextCol--;
    attemptedDir = "L";
  } else if (keys.d || keys.ArrowRight) {
    nextCol++;
    attemptedDir = "R";
  }

  if (attemptedDir) {
    player.dir = attemptedDir;

    if (canMoveToCell(nextRow, nextCol)) {
      //
      player.targetRow = nextRow;
      player.targetCol = nextCol;
      player.isMoving = true;
      //
    }
  }
}

function movePlayer(dt) {
  const speed = c.PLAYER_SPEED * dt;

  if (player.dir === "U") {
    player.posY -= speed;
    if (player.posY <= player.targetRow * c.CELL_SIZE) finishMove();
  }

  if (player.dir === "D") {
    player.posY += speed;
    if (player.posY >= player.targetRow * c.CELL_SIZE) finishMove();
  }

  if (player.dir === "R") {
    player.posX += speed;
    if (player.posX >= player.targetCol * c.CELL_SIZE) finishMove();
  }

  if (player.dir === "L") {
    player.posX -= speed;
    if (player.posX <= player.targetCol * c.CELL_SIZE) finishMove();
  }

  utils.updateFrame(player);
}

function finishMove() {
  player.posX = player.targetCol * c.CELL_SIZE;
  player.posY = player.targetRow * c.CELL_SIZE;

  player.row = player.targetRow;
  player.col = player.targetCol;

  player.isMoving = false;
}

function updatePlayer(dt) {
  if (player.isMoving) {
    movePlayer(dt);
  }

  if (!player.isMoving) {
    setPlayerTarget();
  }

  updatePlayerImmunity(dt);
}
function updatePlayerImmunity(dt) {
  if (player.immune) {
    player.immuneTimer -= dt;
    if (player.immuneTimer <= 0) {
      player.immune = false;
    }
  }
}

function animatePlayer() {
  let x = player.posX | 0;
  let y = player.posY | 0;

  player.elem.style.transform = `
  translate(${x}px, ${y}px)
  `;

  utils.animateFrame(player);
}

function damagePlayer() {
  if (player.immune) return;

  player.lives--;
  if (player.lives <= 0) endGame("No More Lives");

  player.immuneTimer = c.IMMUNITY_TIME;
  player.immune = true;
}

function resetPlayer() {
  player.posX = 50;
  player.posY = 50;
  player.row = 1;
  player.col = 1;

  player.isMoving = false;
  player.dir = "D";

  player.frame = 0;
  player.frameProg = 0;

  player.score = 0;
  player.lives = 3;
  player.immune = false;
  player.immuneTimer = 0;

  player.elem.style.opacity = "1";
}
