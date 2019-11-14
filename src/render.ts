///<reference types="pixi.js"/>
// handles all rendering and visual output
// this is deliberately kept separate from internal game logic

import * as PIXI from "pixi.js"; // neat graphics library
import * as game from "./game"; // Represents the overall game state
import * as entity from "./entity"; // Needed for displaying entities
import * as item from "./item"; // Needed for displaying inventory items
import * as room from "./room"; // everything room related!
import * as tile from "./tile";
export let ready = false; // make sure we don't render anything before that has been initialized

let heldItemDisplay = document.getElementById("selectedItemDisplay");
let temporaryToastDiv = document.getElementById("temporaryToast"); // TODO: make toast less temporary
let inventoryButtonsDiv = document.getElementById("inventoryButtons");
inventoryButtonsDiv.innerHTML = "Please wait while the game loads!";
let pauseButton = document.getElementById("pauseButton");

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
  .add("assets/missing.png")
  .add("assets/lifebud.png")
  .add("assets/lifeseed.png")
  .load(setup);

// DEFINE TILE TEXTURE MAP
let tileTextureMap = new Map<tile.TILE_TYPE, PIXI.Texture>(); // we match tile types with textures

// DEFINE ENTITY TEXTURE MAP
let entityTextureMap = new Map<entity.ENTITY_TYPE, PIXI.Texture>();

// DEFINE ITEM TEXTURE MAP
let itemTextureMap = new Map<item.ITEM_TYPE, PIXI.Texture>();
// TODO: item textures

function setup() {
  document.body.appendChild(app.view);

  // SETUP TEXTURES

  tileTextureMap
    .set(tile.TILE_TYPE.DIRT, app.loader.resources["assets/dirt.png"].texture)
    .set(tile.TILE_TYPE.STONE, app.loader.resources["assets/stone.png"].texture)
    .set(
      tile.TILE_TYPE.WATER,
      app.loader.resources["assets/water.png"].texture
    );

  entityTextureMap
    .set(
      entity.ENTITY_TYPE.PLANT_LIFEBUD,
      app.loader.resources["assets/lifebud.png"].texture
    )
    .set(
      entity.ENTITY_TYPE.OBJECT_STONE,
      app.loader.resources["assets/stone.png"].texture
    );

  ready = true;
}

// this should be called every time the game updates
export function render() {
  if (ready) {
    //console.log("Updating screen!");
    while (app.stage.children[0]) {
      app.stage.removeChild(app.stage.children[0]);
    } // remove all existing objects

    /* TODO: finish smart tile replacement
    app.stage.children.forEach((sprite: PIXI.Sprite) => {
      switch (sprite.name) {
        case "Tile":
          if (game.currentGame.getCurrentRoom().getTile(convertScreenToMapCoords(sprite.x, sprite.y).x, convertScreenToMapCoords(sprite.x, sprite.y).y).getType() != 
          )
          break;
        case "Entity":
          break;
      }
    });
    */

    // TODO: implement smart entity replacement

    // UPDATE UI

    // make the pause button do something
    pauseButton.onclick = () => {
      game.currentGame.togglePause();
    };

    // show buttons for each inventory item
    inventoryButtonsDiv.innerHTML = ""; // wipe this clean!
    game.currentGame
      .getCurrentPlayer()
      .getInventory()
      .getContents()
      .forEach(function(item: item.Item) {
        //sconsole.log("Creating button for item " + item.getDisplayName());
        let itemButton = document.createElement("BUTTON");
        if (item.isKeyItem() == true) {
          // key items won't need to display a quantity
          itemButton.innerHTML = item.getDisplayName();
        } else {
          itemButton.innerHTML =
            item.getDisplayName() + " x " + item.getQuantity();
        }

        itemButton.onclick = function() {
          game.currentGame
            .getCurrentPlayer()
            .setSelectedItem(item.getItemType());
        };

        inventoryButtonsDiv.appendChild(itemButton);
      });

    // show current held item
    if (
      game.currentGame
        .getCurrentPlayer()
        .getSelectedItem()
        .isKeyItem() == true
    ) {
      // key items won't need to display a quantity
      heldItemDisplay.innerHTML = game.currentGame
        .getCurrentPlayer()
        .getSelectedItem()
        .getDisplayName();
    } else {
      heldItemDisplay.innerHTML =
        game.currentGame
          .getCurrentPlayer()
          .getSelectedItem()
          .getDisplayName() +
        " x " +
        game.currentGame
          .getCurrentPlayer()
          .getSelectedItem()
          .getQuantity();
    }

    // RENDER MAP

    let currentMap = game.currentGame.getCurrentRoom().getTileMap();

    for (let xStep = 0; xStep < currentMap.length; xStep++) {
      for (let yStep = 0; yStep < currentMap[0].length; yStep++) {
        let currentTile: PIXI.Sprite;

        // set appropriate texture
        currentTile = new PIXI.Sprite(
          tileTextureMap.get(currentMap[xStep][yStep].getType())
        );

        currentTile.x = (xStep + 1) * 16 - 16;
        currentTile.y = (yStep + 1) * 16 - 16;
        currentTile.name = "Tile";
        currentTile.interactive = true; // tiles should be clickable!

        let mouseDown = function() {
          // use the player's held item to use this target
          // if this was successful, result will be true
          let result = game.currentGame
            .getCurrentPlayer()
            .getSelectedItem()
            .useItem(undefined, currentMap[xStep][yStep]);

          if (!result) {
            displayToastNotification("That didn't work.");
          } else {
            render(); // update screen
          }
        };

        currentTile.on("mousedown", mouseDown);
        currentTile.on("touchend", mouseDown);
        app.stage.addChild(currentTile);
      }
    }

    // RENDER ENTITIES
    let currentEntities = game.currentGame.getCurrentRoom().getEntities();

    currentEntities.forEach(function(currentEntity: entity.Entity) {
      if (currentEntity.getVisibility() == true) {
        // only do any of this if the entity is visible
        let currentEntityDisplayName = currentEntity.getDisplayName();
        let currentEntitySprite: PIXI.Sprite;

        if (entityTextureMap.get(currentEntity.getType()) != undefined) {
          currentEntitySprite = new PIXI.Sprite(
            entityTextureMap.get(currentEntity.getType())
          );
        } else {
          currentEntitySprite = new PIXI.Sprite(
            app.loader.resources["assets/missing.png"].texture
          );
        }

        currentEntitySprite.x = (currentEntity.getPosition().x + 1) * 16 - 16;
        currentEntitySprite.y = (currentEntity.getPosition().y + 1) * 16 - 16;
        currentEntitySprite.interactive = true; // tiles should be clickable!
        currentEntitySprite.name = "Entity";

        let mouseDown = function() {
          dismissTooltip(); // since mouseout doesn't get triggered when you click it
          // use the player's held item to use this target
          // if this was successful, result will be true
          let result = game.currentGame
            .getCurrentPlayer()
            .getSelectedItem()
            .useItem(currentEntity);

          if (!result) {
            displayToastNotification("That didn't work.");
          } else {
            render(); // update screen
          }
        };

        currentEntitySprite.on("mousedown", mouseDown); // pass through to its click function
        currentEntitySprite.on("touchend", mouseDown); // should work on mobile too
        currentEntitySprite.on("mouseover", () => {
          // what do we do when the mouse is over this?
          displayTooltip(currentEntityDisplayName);
        });
        currentEntitySprite.on("mouseout", () => {
          // what do we do when the mouse leaves?
          dismissTooltip();
        });

        app.stage.addChild(currentEntitySprite);
      }
    });
  }
}

// converts a screenspace XY to map XY
function convertScreenToMapCoords(
  screenX: number,
  screenY: number
): game.Position {
  let tileX = (screenX + 16) / 16 - 1;
  let tileY = (screenY + 16) / 16 - 1;
  return { x: tileX, y: tileY };
}

// show a tooltip on the screen (only one at a time!)
function displayTooltip(text: string) {
  console.log("Mouse moved over " + text);
  //TODO: display tooltip
}

// dismiss the visible tooltip (only one at a time!)
function dismissTooltip() {
  console.log("Mouse left");
  // TODO: dismiss tooltip
}

// shows a toast notification (this can be called from other files!)
// we assume 2000ms if a duration is not specified
export function displayToastNotification(text: string, duration?: number) {
  // TODO: make toast less temporary
  temporaryToastDiv.innerHTML = text;
  let actualDuration = 2000;
  if (duration != undefined) actualDuration = duration;

  /*setTimeout(() => {
      temporaryToastDiv.innerHTML = "";
    }, actualDuration);*/ //TODO: fix timeout
}

/*
// displays a small number at a position to indicate a change
export function displayNumberThingPleaseRenameThisFunction(position: game.Position, text: string, color: number) {
    // TODO: number thing
    // TODO: change color to usable variable type
}
*/
