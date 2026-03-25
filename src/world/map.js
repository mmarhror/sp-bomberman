import * as c from "../game/config.js";
import * as utils from "../game/utils.js";

export let entityLayer = document.getElementById("entity-layer");

let gridLayer = document.getElementById("grid-layer");

export function copyArray(arr) {
  return arr.map((row) => row.slice());
}

export let map;

export function resetMap() {
  map = copyArray(c.BASE_MAP);
}

export function initWood() {
  let candidates = [];
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (!(row <= 2 && col <= 2) && map[row][col] !== 1) {
        candidates.push([row, col]);
      }
    }
  }
  utils.shuffle(candidates);
  for (let i = 0; i < Math.min(c.WOOD_NUMBER, candidates.length); i++) {
    let row = candidates[i][0];
    let col = candidates[i][1];
    map[row][col] = 2;
  }
}

export function renderGrid() {
  gridLayer.innerHTML = "";

  let frag = document.createDocumentFragment();
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      let cell = map[row][col];

      let block = document.createElement("div");
      block.classList = "block";
      if (cell == 1) {
        block.classList.add("wall");
      } else {
        if (cell === 2) {
          block.classList.add("wood");
        } else {
          block.classList.add("grass");
        }
        //
      }
      block.setAttribute("id", `${row}-${col}`);
      frag.appendChild(block);
    }
  }

  gridLayer.appendChild(frag);
}
