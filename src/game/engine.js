import * as mapRepo from "../world/map.js";
import * as hud from "./hud.js";

import { gameState } from "./state.js";
import * as state from "./state.js";

import { player } from "../entities/player.js";
import { enemiesRouter } from "../entities/enemies.js";
import { bombsRouter } from "../entities/bombs.js";
import { firesRouter } from "../entities/fires.js";

export function initGame() {
  mapRepo.resetMap();

  player.init();

  mapRepo.initWood();

  enemiesRouter.init();

  firesRouter.initPoll();

  mapRepo.renderGrid();
}

function updateHud() {
  hud.renderScore(player.score);
  hud.renderTime(gameState.timer);
  hud.renderLives(player.lives);
}

function updateEntities(dt) {
  player.update(dt);
  enemiesRouter.update(dt);
  bombsRouter.update(dt);
  firesRouter.update();
}

function animateEntities() {
  player.animate();
  enemiesRouter.animate();
  bombsRouter.animate();
  firesRouter.animate();
}

let lastTime = 0;
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (!gameState.over && !gameState.paused) {
    //
    state.updateTimer(dt);
    updateHud();
    updateEntities(dt);
    animateEntities();
        
  }

  if (gameState.paused) {
    hud.showPauseMenu();
  } else {
    hud.hidePauseMenu()
  }

  requestAnimationFrame(gameLoop);
}

export function startGameLoop() {
  requestAnimationFrame(gameLoop);
}

export function restartGame() {
  hud.hideGameOver();
  state.resetGameState();

  player.reset();
  enemiesRouter.reset();
  bombsRouter.reset();
  firesRouter.reset();

  mapRepo.resetMap();
  mapRepo.initWood();
  mapRepo.renderGrid();

  enemiesRouter.init();

  lastTime = 0;
}
