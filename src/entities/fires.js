import { map, entityLayer } from "../world/map.js";
import * as c from "../game/config.js";

export let firesRouter = {
  firesPoll: [],
  fires: [],

  initPoll: initFiresPoll,

  init: initFires,
  update: updateFires,
  animate: animateFires,

  reset: resetFires,
};

function initFiresPoll() {
  let frag = document.createDocumentFragment();

  for (let cnt = 0; cnt < 20; cnt++) {
    let fire = document.createElement("div");
    fire.classList = "fire";
    fire.style.display = "none";
    fire.active = false;

    frag.appendChild(fire);

    firesRouter.firesPoll.push(fire);
  }

  entityLayer.appendChild(frag);
}

function getFiresCoords(bomb) {
  let dirs = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
  ];

  let coords = [[bomb.row, bomb.col]];

  for (let [x, y] of dirs) {
    let row = bomb.row + x;
    let col = bomb.col + y;

    if (row < map.length && row >= 0 && col < map[0].length && col >= 0) {
      if (map[row][col] !== 1) coords.push([row, col]);
    }
  }

  return coords;
}

function initFires(bomb) {
  let coords = getFiresCoords(bomb);

  coords.forEach((coord) => {
    let row = coord[0];
    let col = coord[1];

    let fire = {
      row: row,
      col: col,
      frame: 1,
      frameProg: 0,
    };

    fire.elem = firesRouter.firesPoll.filter((f) => !f.active)[0];

    fire.elem.style.transform = `
    translate(${col * c.CELL_SIZE}px, ${row * c.CELL_SIZE}px)
    `;

    fire.elem.style.display = "block";
    fire.elem.active = true;

    firesRouter.fires.push(fire);
  });
}

function removeFire(fire) {
  fire.elem.style.display = "none";
  fire.elem.active = false;
}

function updateFires() {
  for (let i = firesRouter.fires.length - 1; i >= 0; i--) {
    let fire = firesRouter.fires[i];

    if (fire.frame >= 6) {
      removeFire(fire);

      firesRouter.fires.splice(i, 1);
    }
  }
}
function animateFires() {
  firesRouter.fires.forEach((fire) => {
    //
    fire.frameProg++;
    if (fire.frameProg === 2) {
      //
      fire.elem.style.backgroundPosition = `
      -${fire.frame * c.FIRE_FRAME}px 0px
      `;

      fire.frame++;
      fire.frameProg = 0;
    }
  });
}

function resetFires() {
  firesRouter.firesPoll.forEach((fire) => {
    fire.style.display = "none";
    fire.active = false;
  });

  firesRouter.fires = [];
}
