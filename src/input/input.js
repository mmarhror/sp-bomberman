import { bombsRouter } from "../entities/bombs.js";

import {
  gameState,
  togglePauseGame,
  resumeGame,
  endGame,
} from "../game/state.js";

import { restartGame } from "../game/engine.js";

export const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,

  w: false,
  s: false,
  a: false,
  d: false,
};

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyP") {
    togglePauseGame();
  }

  if (event.code === "KeyR") {
    restartGame();
  }

  if (gameState.paused) return;

  if (event.key in keys) keys[event.key] = true;

  if (event.code === "Space") {
    bombsRouter.init();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;
});

document.getElementById("btn-resume").addEventListener("click", resumeGame);
document.getElementById("btn-restart").addEventListener("click", restartGame);
document
  .getElementById("btn-play-again")
  .addEventListener("click", restartGame);
