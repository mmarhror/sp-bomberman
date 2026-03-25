import * as c from "./config.js";
import { showGameOver } from "./hud.js";
import { player } from "../entities/player.js";

export let gameState = {
  timer: c.DEFAULT_TIMER,
  paused: false,
  over: false,

  goReason: "",
};

export function resetGameState() {
  gameState.timer = c.DEFAULT_TIMER;
  gameState.paused = false;
  gameState.over = false;
}

export function togglePauseGame() {
  if (gameState.over) return;
  gameState.paused = !gameState.paused;
}

export function resumeGame() {
  if (gameState.over) return;
  gameState.paused = false;
}

export function endGame(reason) {
  if (gameState.over) return;

  showGameOver(player.score, reason);

  gameState.over = true;
  gameState.paused = true;
}

export function updateTimer(dt) {
  if (gameState.timer - dt <= 0) {
    endGame("Time ended");
    return;
  }
  gameState.timer -= dt;
}
