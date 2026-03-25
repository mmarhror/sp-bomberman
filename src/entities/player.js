import { map, entityLayer } from "../world/map.js";
import * as c from "../game/config.js";
import * as utils from "../game/utils.js";

import { keys } from "../input/input.js";
import { endGame } from "../game/state.js";

export let player = {
  posX: 50,
  posY: 50,
  row: 1,
  col: 1,
  frame: 0,
  frameProg: 0,
  dir: "D",

  moving: false,

  score: 0,
  lives: 3,
  immune: false,
  immuneTimer: 0,

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

function canMoveTo(x, y) {
  const margin = 5;
  const left = x + margin;
  const right = x + c.CELL_SIZE - margin;
  const top = y + margin;
  const bottom = y + c.CELL_SIZE - margin;

  const leftCol = Math.floor(left / c.CELL_SIZE);
  const rightCol = Math.floor(right / c.CELL_SIZE);
  const topRow = Math.floor(top / c.CELL_SIZE);
  const bottomRow = Math.floor(bottom / c.CELL_SIZE);

  for (let row = topRow; row <= bottomRow; row++) {
    for (let col = leftCol; col <= rightCol; col++) {
      if (row < 0 || row >= map.length || col < 0 || col >= map[0].length)
        return false;
      if (map[row][col] === 1 || map[row][col] === 2) return false;
    }
  }
  return true;
}

function updatePlayerGridPosition() {
  const centerX = player.posX + c.CELL_SIZE / 2;
  const centerY = player.posY + c.CELL_SIZE / 2;
  player.row = Math.floor(centerY / c.CELL_SIZE);
  player.col = Math.floor(centerX / c.CELL_SIZE);
}

function getPlayerInput(dx = 0, dy = 0) {
  if (keys.w || keys.ArrowUp) {
    dy = -1;
    player.dir = "U";
  }
  if (keys.s || keys.ArrowDown) {
    dy = 1;
    player.dir = "D";
  }
  if (keys.a || keys.ArrowLeft) {
    dx = -1;
    player.dir = "L";
  }
  if (keys.d || keys.ArrowRight) {
    dx = 1;
    player.dir = "R";
  }

  return { dx, dy };
}

function updatePlayerAnimation(dx, dy) {
  player.moving = dx !== 0 || dy !== 0;

  if (player.moving) {
    utils.updateFrame(player);
  } else {
    player.frame = 0;
    player.frameProg = 0;
  }
}

function updatePlayerImmunity(dt) {
  if (player.immune) {
    player.immuneTimer -= dt;
    if (player.immuneTimer <= 0) {
      player.immune = false;
    }
  }
}

function updatePlayer(dt) {
  let { dx, dy } = getPlayerInput();

  const moveAmount = c.PLAYER_SPEED * dt;

  const newX = player.posX + dx * moveAmount;
  const newY = player.posY + dy * moveAmount;

  if (canMoveTo(newX, newY)) {
    player.posX = newX;
    player.posY = newY;

    updatePlayerGridPosition();
  }

  updatePlayerAnimation(dx, dy);
  updatePlayerImmunity(dt);
}

function animatePlayer() {
  player.elem.style.transform = `
  translate(${Math.round(player.posX)}px, ${Math.round(player.posY)}px)
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

  player.moving = false;
  player.dir = "D";

  player.frame = 0;
  player.frameProg = 0;

  player.score = 0;
  player.lives = 3;
  player.immune = false;
  player.immuneTimer = 0;

  player.elem.style.opacity = "1";
}
