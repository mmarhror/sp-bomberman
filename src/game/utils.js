import * as c from "../game/config.js";

export function updateFrame(entity) {
  entity.frameProg++;

  if (entity.frameProg >= c.FRAME_PROG_DURATION) {
    entity.frame = (entity.frame + 1) % 4;

    entity.frameProg = 0;
  }
}

export function animateFrame(entity) {
  if (!entity.dir) return;

  if (entity.immune) {
    const blink = Math.floor(entity.immuneTimer * 10) % 2;
    entity.elem.style.opacity = blink ? "0.2" : "1";
  } else {
    entity.elem.style.opacity = "1";
  }

  let spriteRow = 0;

  if (entity.dir === "R") spriteRow = 3 * c.CHAR_FRAME;
  if (entity.dir === "L") spriteRow = 1 * c.CHAR_FRAME;
  if (entity.dir === "U") spriteRow = 2 * c.CHAR_FRAME;
  if (entity.dir === "D") spriteRow = 0;

  if (entity.moving === false) spriteRow = 0;

  entity.elem.style.backgroundPosition = `
    -${entity.frame * c.CHAR_FRAME}px -${spriteRow}px
  `;
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function parseGameTimer(time) {
  let minutes = String(Math.floor(time / 60));
  let seconds = String(Math.floor(time % 60));

  return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}
