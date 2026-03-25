const pauseMenu = document.getElementById("pause-menu");
const gameOverMenu = document.getElementById("game-over-menu");

export function renderScore(score) {
  let scoreUI = document.getElementById("score");
  if (scoreUI.textContent === String(score)) return;

  scoreUI.textContent = String(score);
}

let lastStrTime = "";
export function renderTime(time) {
  let minutes = String(Math.floor(time / 60));
  let seconds = String(Math.floor(time % 60));

  let strTime = `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;

  if (strTime === lastStrTime) return;

  lastStrTime = strTime;

  let timeUI = document.getElementById("time");
  timeUI.textContent = strTime;
}

export function renderLives(lives) {
  let livesUI = document.getElementById("lives");
  if (livesUI.textContent === String(lives)) return;

  livesUI.textContent = String(lives);
}

export function showPauseMenu() {
  pauseMenu.style.display = "flex";
}

export function hidePauseMenu() {
  pauseMenu.style.display = "none";
}

export function showGameOver(score, reason) {
  document.getElementById("go-score").textContent = score;
  document.getElementById("go-reason").textContent = reason;

  // Add 'win' class if player won
  const gameOverContent = document.querySelector(".game-over-content");
  if (reason.includes("WIN")) {
    gameOverContent.classList.add("win");
  } else {
    gameOverContent.classList.remove("win");
  }

  gameOverMenu.style.display = "flex";
}

export function hideGameOver() {
  gameOverMenu.style.display = "none";
  
  // Remove win class when hiding
  const gameOverContent = document.querySelector(".game-over-content");
  gameOverContent.classList.remove("win");
}
