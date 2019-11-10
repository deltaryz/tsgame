///<reference types="pixi.js"/>
// handles all rendering and visual output
// this is deliberately kept separate from internal game logic

import * as PIXI from "pixi.js";
import { currentGame } from "./game";
import { Entity } from "./game";
import { ENTITY_TEXTURE } from "./game";
export let ready = false;

export const app = new PIXI.Application({
  width: 256,
  height: 256
});

// load assets here
app.loader
  .add("assets/dirt.png")
  .add("assets/stone.png")
  .add("assets/water.png")
  .add("assets/player.png")
  .add("assets/lifeseed.png")
  .load(setup);

function setup() {
  document.body.appendChild(app.view);

  ready = true;
}

// this should be called every time the game updates
export function render() {
  if (ready) {
    while (app.stage.children[0]) {
      app.stage.removeChild(app.stage.children[0]);
    } // remove all existing objects

    // RENDER MAP

    let currentMap = currentGame.getCurrentRoom().getTileMap();

    for (let xStep = 0; xStep < currentMap.length; xStep++) {
      for (let yStep = 0; yStep < currentMap[0].length; yStep++) {
        let currentTile: PIXI.Sprite;

        // set appropriate texture
        switch (currentMap[xStep][yStep].getType()) {
          default:
          case "DIRT":
            currentTile = new PIXI.Sprite(
              app.loader.resources["assets/dirt.png"].texture
            );
            break;
          case "STONE":
            currentTile = new PIXI.Sprite(
              app.loader.resources["assets/stone.png"].texture
            );
            break;
          case "WATER":
            currentTile = new PIXI.Sprite(
              app.loader.resources["assets/water.png"].texture
            );
            break;
        }
        currentTile.x = (xStep + 1) * 16 - 16;
        currentTile.y = (yStep + 1) * 16 - 16;
        currentTile.interactive = true; // tiles should be clickable!
        currentTile.on("mousedown", currentMap[xStep][yStep].onClick);
        app.stage.addChild(currentTile);
      }
    }

    // RENDER ENTITIES
    let currentEntities = currentGame.getCurrentRoom().getEntities();

    currentEntities.forEach(function(currentEntity) {
      let currentEntitySprite: PIXI.Sprite;
      switch (currentEntity.getTexture()) {
        case ENTITY_TEXTURE.PLANT_LIFESEED:
          currentEntitySprite = new PIXI.Sprite(
            app.loader.resources["assets/lifeseed.png"].texture
          );
          break;

        default:
          currentEntitySprite = new PIXI.Sprite(
            app.loader.resources["assets/player.png"].texture
          );
          break;
      }
      currentEntitySprite.x = (currentEntity.getPosition().x + 1) * 16 - 16;
      currentEntitySprite.y = (currentEntity.getPosition().y + 1) * 16 - 16;
      currentEntitySprite.interactive = true; // tiles should be clickable!
      currentEntitySprite.on("mousedown", currentEntity.onClick);
      app.stage.addChild(currentEntitySprite);
    });
  }
}
