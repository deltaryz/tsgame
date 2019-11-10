// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

import { render } from "./render"; // keep the rendering outside the game logic

export let currentGame: Game; // this will be used to reference anything relating to the current game state

// keeps track of game state
class Game {
  private currentRoom: Room;
  private currentState: GAME_STATE;
  private currentPlayer: Player;

  // we initialize each of these components separately from the gamestate initialization
  // this makes it easier to swap them on the fly!
  constructor(
    currentRoom: Room,
    currentState: GAME_STATE,
    currentPlayer: Player
  ) {
    this.currentRoom = currentRoom;
    this.currentState = currentState;
    this.currentPlayer = currentPlayer;
  }

  // returns the current room
  getCurrentRoom(): Room {
    return this.currentRoom;
  }

  // sets the current room
  setCurrentRoom(newRoom: Room) {
    console.log("Changing rooms...");
    this.currentRoom = newRoom;
  }

  // returns the current GameState
  getCurrentState(): GAME_STATE {
    return this.currentState;
  }

  // sets the current GameState
  setCurrentState(newState: GAME_STATE) {
    console.log("Setting game state to to " + newState);
    this.currentState = newState;
  }

  // returns the current Player
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  // sets the current Player
  setCurrentPlayer(player: Player) {
    console.log("Setting player to " + player.getName());
    this.currentPlayer = player;
  }
}

// represents what state the game is currently in
enum GAME_STATE {
  INITIALIZE = "INITIALIZE",
  MENU = "MENU",
  GAMEPLAY = "GAMEPLAY"
}

// Item class
class Item {
  private name: string;

  // item names are not the same thing as the item type!
  constructor(name: string) {
    this.name = name;
  }

  // returns the name of the item
  getName(): string {
    return this.name;
  }

  // sets the name of the item
  setName(name: string) {
    this.name = name;
  }

  // returns a description of the item
  inspect(target: Entity): String {
    return "TODO: item inspection";
  }
}

// represents which types of tile can exist
enum TILE_TYPE {
  DIRT = "DIRT",
  STONE = "STONE",
  WATER = "WATER"
}

// tiles occupy single coordinates of world space
class Tile {
  private type: TILE_TYPE;

  constructor(type: TILE_TYPE) {
    this.type = type;
  }

  // returns the type of tile this is
  getType(): TILE_TYPE {
    return this.type;
  }

  // changes the type of the tile
  setType(type: TILE_TYPE) {
    this.type = type;
  }

  // what should we do when the tile is clicked?
  onClick = () => {
    this.setType(currentGame.getCurrentPlayer().getSelectedTile());
    render();
  };
}

// textures for entities!
export enum ENTITY_TEXTURE {
  PLANT_LIFESEED = "PLANT_LIFESEED"
}

// Entity class
// Any object in the world that is not a tile
export class Entity {
  private inventory: Inventory; // all entities can have inventories
  private position: Position;
  private texture: ENTITY_TEXTURE;

  constructor(
    position?: Position,
    inventoryItems?: Item[],
    texture?: ENTITY_TEXTURE
  ) {
    if (position != undefined) {
      this.position = position;
    } else {
      this.position = { x: 0, y: 0 };
    }

    if (texture != undefined) this.texture = texture;

    this.inventory = new Inventory(inventoryItems);
  }

  // get position of the entity
  getPosition(): Position {
    return this.position;
  }

  // get the selected texture of an entity
  getTexture(): ENTITY_TEXTURE {
    return this.texture;
  }

  // what should we do when this entity is clicked?
  // this should be overridden by extending classes
  // override with onClick = () => { ... }
  public onClick() {
    console.log("An entity was clicked!");
  }
}

// types of plants!
enum PLANT_TYPE {
  LIFESEED = "LIFESEED"
}

// Plant item
class Plant extends Entity {
  private type: PLANT_TYPE;

  constructor(type: PLANT_TYPE) {
    super();
    switch (type) {
      case PLANT_TYPE.LIFESEED:
        super(undefined, undefined, ENTITY_TEXTURE.PLANT_LIFESEED);
        break;
    }
    this.type = type;
  }

  // returns type of plant this is
  getType(): PLANT_TYPE {
    return this.type;
  }

  public onClick = () => {
    super.onClick();
    console.log("A " + this.getType() + " was clicked!");
  };
}

// Items in the world
class ItemEntity extends Entity {
  private item: Item;

  constructor(position?: Position) {
    super(position);
  }
}

// Player class
class Player extends Entity {
  private name: string;
  private selectedTile: TILE_TYPE;

  constructor(name: string, position?: Position, inventoryItems?: Item[]) {
    super(position, inventoryItems);

    this.name = name;
    this.selectedTile = TILE_TYPE.STONE;
  }

  // returns the selected tile type
  getSelectedTile(): TILE_TYPE {
    return this.selectedTile;
  }

  // sets the selected tile type
  setSelectedTile(tile: TILE_TYPE) {
    console.log("Player's selected tile set to " + tile);
    this.selectedTile = tile;
  }

  // returns the player's name
  getName(): string {
    return this.name;
  }

  // sets the player's name
  setName(name: string) {
    this.name = name;
  }
}

// anything that can contain items will have this
class Inventory {
  private items: Item[];
  private capacity: number;

  constructor(items?: Item[]) {
    if (items != undefined) {
      this.items = items;
    } else {
      this.items = [];
    }
  }

  // insert an item into the inventory
  addItem(item: Item): string {
    return "TODO: add items to inventories";
  }
}

// Different room types will generate different terrain
enum ROOM_TYPE {
  BASIC = "BASIC"
}

// the world map
class Room {
  private entities: Entity[];
  private tiles: Tile[][];
  private sizeX: number;
  private sizeY: number;

  // generate the room!
  constructor(type: ROOM_TYPE, sizeX: number, sizeY: number) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.entities = [];

    console.log(
      "Now generating room type " +
        type +
        " with size X: " +
        sizeX +
        ", Y: " +
        sizeY
    );

    // which room type are we going to generate?
    switch (type) {
      case ROOM_TYPE.BASIC:
        // this will generate nothing but dirt

        this.tiles = []; // set up each row!
        for (let xStep = 0; xStep < sizeX; xStep++) {
          this.tiles[xStep] = []; // set up each column!
          for (let yStep = 0; yStep < sizeY; yStep++) {
            // these kinds of for loops are hell

            // create a new dirt tile
            this.setTile(xStep, yStep, new Tile(TILE_TYPE.DIRT)); // assign that tile to a place in the world map
          }
        }
        break;
    }
  }

  // inserts an entity into the room
  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  // returns list of all entities
  getEntities(): Entity[] {
    return this.entities;
  }

  // sets a specific file and checks to make sure its position is valid
  setTile(locX: number, locY: number, tile: Tile) {
    if (locX < this.sizeX && locX >= 0 && locY < this.sizeY && locY >= 0) {
      // make sure it's a valid tile!
      this.tiles[locX][locY] = undefined; // make sure the old tiles get GC'd
      this.tiles[locX][locY] = tile;
    } else {
      console.log(
        "Something attempted to place a " +
          tile.getType() +
          " tile at " +
          locX +
          ", " +
          locY +
          " outside the map boundary."
      );
    }
  }

  // returns the entire array of tiles
  getTileMap(): Tile[][] {
    return this.tiles;
  }

  // returns the size of the room
  getRoomSize() {
    return this.sizeX, this.sizeY;
  }
}

// location on map
interface Position {
  x: number;
  y: number;
}

// INITIALIZE UI
let waterButton = document.getElementById("waterButton");
let stoneButton = document.getElementById("stoneButton");

waterButton.onclick = function() {
  currentGame.getCurrentPlayer().setSelectedTile(TILE_TYPE.WATER);
};

stoneButton.onclick = function() {
  currentGame.getCurrentPlayer().setSelectedTile(TILE_TYPE.STONE);
};

// INITIALIZE GAME

let defaultRoom = new Room(ROOM_TYPE.BASIC, 16, 16);
let defaultPlayer = new Player("Farmer");

let defaultLifeseed = new Plant(PLANT_TYPE.LIFESEED);
defaultRoom.addEntity(defaultLifeseed);
// this will contain everything relevant to the current game
currentGame = new Game(defaultRoom, GAME_STATE.INITIALIZE, defaultPlayer);

// we keep the rendering code separate so that it can easily be changed or reworked
setTimeout(render, 2000);
