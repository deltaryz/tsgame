///<reference types="pixi.js"/>
// handles all rendering and visual output
// this is deliberately kept separate from internal game logic

import * as PIXI from "pixi.js"; // neat graphics library
import { currentGame } from "./game"; // Represents the overall game state
import { Entity } from "./game"; // Needed for displaying entities
import { Item } from "./game"; // Needed for displaying inventory items
import { ENTITY_TEXTURE } from "./game"; // This represents what texture to use
export let ready = false; // make sure we don't render anything before that has been initialized

let heldItemDisplay = document.getElementById("selectedItemDisplay");

let inventoryButtonsDiv = document.getElementById("inventoryButtons");
inventoryButtonsDiv.innerHTML = "Please wait while the game loads!";

export const app = new PIXI.Application({
  width: 256,
  height: 256
});

// load assets here
// all of them do have to be loaded manually.
// there should be a spritesheet for this eventually
app.loader
  .add("assets/dirt.png")
  .add("assets/stone.png")
  .add("assets/water.png")
  .add("assets/player.png")
  .add("assets/lifebud.png")
  .add("assets/lifeseed.png")
  .load(setup);

function setup() {
  document.body.appendChild(app.view);

  ready = true;
}

// this should be called every time the game updates
export function render() {
  if (ready) {
    console.log("Updating screen!");
    while (app.stage.children[0]) {
      app.stage.removeChild(app.stage.children[0]);
    } // remove all existing objects

    // UPDATE UI

    // show buttons for each inventory item
    inventoryButtonsDiv.innerHTML = ""; // wipe this clean!
    currentGame
      .getCurrentPlayer()
      .getInventory()
      .getContents()
      .forEach(function(item: Item) {
        console.log("Creating button for item " + item.getName());
        let itemButton = document.createElement("BUTTON");
        itemButton.innerHTML = item.getName() + " x " + item.getQuantity();
        itemButton.onclick = function() {
          currentGame.getCurrentPlayer().setSelectedItem(item);
        };
        inventoryButtonsDiv.appendChild(itemButton);
      });

    // show current held item
    heldItemDisplay.innerHTML =
      currentGame
        .getCurrentPlayer()
        .getSelectedItem()
        .getName() +
      " x " +
      currentGame
        .getCurrentPlayer()
        .getSelectedItem()
        .getQuantity();

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
        case ENTITY_TEXTURE.PLANT_LIFEBUD:
          currentEntitySprite = new PIXI.Sprite(
            app.loader.resources["assets/lifebud.png"].texture
          );
          break;

        case ENTITY_TEXTURE.OBJECT_STONE:
          currentEntitySprite = new PIXI.Sprite(
            app.loader.resources["assets/stone.png"].texture
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
