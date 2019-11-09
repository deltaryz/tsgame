///<reference types="pixi.js"/>
// handles all rendering and visual output
// this is deliberately kept separate from internal game logic

export const renderFramerate = 30; // what it says on the tin
import * as PIXI from "pixi.js";
import { currentGame } from "./game";
export let ready = false;

export const app = new PIXI.Application({
  width: 256,
  height: 256
});

// load assets here
app.loader.add("assets/dirt.png").load(setup);

function setup() {
  document.body.appendChild(app.view);

  ready = true;
}

// this should be called every time the game updates
function render() {
  if (ready) {
    while (app.stage.children[0]) {
      app.stage.removeChild(app.stage.children[0]);
    } // remove all existing objects
    let currentMap = currentGame.getCurrentRoom().getTileMap();

    for (let xStep = 0; xStep < currentMap.length; xStep++) {
      for (let yStep = 0; yStep < currentMap[0].length; yStep++) {
        let currentTile = new PIXI.Sprite(
          app.loader.resources["assets/dirt.png"].texture
        );
        currentTile.x = (xStep + 1) * 16 - 16;
        currentTile.y = (yStep + 1) * 16 - 16;
        currentTile.interactive = true; // tiles should be clickable!
        currentTile.on("mousedown", currentMap[xStep][yStep].onClick);
        app.stage.addChild(currentTile);
      }
    }
  }
}

export function startRender() {
  setTimeout(function() {
    requestAnimationFrame(startRender);
    render();
  }, 1000 / renderFramerate);
}
