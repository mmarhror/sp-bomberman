import { map, entityLayer } from "../world/map.js";
import * as c from "../game/config.js";

import { player } from "./player.js";
import { enemiesRouter } from "./enemies.js";
import { firesRouter } from "./fires.js";

export let bombsRouter = {
  bombs: [],

  init: initBomb,
  update: updateBombs,
  animate: animateBombs,

  reset: resetBombs,
};

function initBomb() {
  if (bombsRouter.bombs.length >= 4) return;

  let bomb = {
    row: player.row,
    col: player.col,
    elem: document.createElement("div"),
    frame: 0,
    frameProg: 0,

    timer: c.BOMB_TIME,
  };

  bomb.elem.classList = "bomb";
  bomb.elem.style.transform = `
  translate(${bomb.col * c.CELL_SIZE}px, ${bomb.row * c.CELL_SIZE}px)
  `;

  bombsRouter.bombs.push(bomb);

  entityLayer.appendChild(bomb.elem);
}

function updateBombs(dt) {
  bombsRouter.bombs = bombsRouter.bombs.filter((bomb) => {
    //
    bomb.timer -= dt;

    if (bomb.timer <= 0) {
      firesRouter.init(bomb);
      impactFire();
      bomb.elem.remove();
      return false;
    }
    //
    return true;
  });
}

function animateBombs() {
  bombsRouter.bombs.forEach((bomb) => {
    //
    bomb.frameProg++;
    if (bomb.frameProg === c.FRAME_PROG_DURATION) {
      //
      bomb.elem.style.backgroundPosition = `
        -${bomb.frame * c.BOMB_FRAME}px 0px
        `;
      //
      bomb.frame = (bomb.frame + 1) % 4;
      bomb.frameProg = 0;
    }
    //
  });
}

function resetBombs() {
  bombsRouter.bombs.forEach((bomb) => {
    bomb.elem.remove();
  });

  bombsRouter.bombs = [];
}

function impactFire() {
  let firesPos = {};
  firesRouter.fires.forEach((fire) => {
    firesPos[`${fire.row} ${fire.col}`] = true;

    if (map[fire.row][fire.col] === 2) {
      document.getElementById(`${fire.row}-${fire.col}`).classList =
        "block grass";
      map[fire.row][fire.col] = 0;
      player.score += c.WOOD_SCORE;
    }
  });

  let playerPos = `${player.row} ${player.col}`;
  if (playerPos in firesPos) {
    player.damage();
  }

  enemiesRouter.remove(firesPos);
}
