// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

import { startRender } from "./render"; // keep the rendering outside the game logic

// keeps track of game state
class Game {
  private currentRoom: Room;
  private currentState: GameState;
  private currentPlayer: Player;

  // we initialize each of these components separately from the gamestate initialization
  // this makes it easier to swap them on the fly!
  constructor(
    currentRoom: Room,
    currentState: GameState,
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
    this.currentRoom = newRoom;
  }

  // returns the current GameState
  getCurrentState(): GameState {
    return this.currentState;
  }

  // sets the current GameState
  setCurrentState(newState: GameState) {
    this.currentState = newState;
  }

  // returns the current Player
  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  // sets the current Player
  setCurrentPlayer(player: Player) {
    this.currentPlayer = player;
  }
}

// represents what state the game is currently in
enum GameState {
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
enum TileType {
  DIRT = "DIRT"
}

// tiles occupy single coordinates of world space
class Tile {
  private type: TileType;

  constructor(type: TileType) {
    this.type = type;
  }

  // returns the type of tile this is
  getType(): TileType {
    return this.type;
  }

  // what should we do when the tile is clicked?
  onClick = () => {
    console.log("User has clicked a " + this.getType() + " tile!");
  };
}

// Entity class
// Any object in the world that is not a tile
class Entity {
  private inventory: Inventory; // all entities can have inventories
  private position: Position;

  constructor(position?: Position, inventoryItems?: Item[]) {
    if (!position == undefined) {
      this.position = position;
    }

    this.inventory = new Inventory(inventoryItems);
  }
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

  constructor(name: string, position?: Position, inventoryItems?: Item[]) {
    super(position, inventoryItems);

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
enum RoomType {
  BASIC
}

// the world map
class Room {
  private entities: Entity[];
  private tiles: Tile[][];
  private sizeX: number;
  private sizeY: number;

  // generate the room!
  constructor(type: RoomType, sizeX: number, sizeY: number) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

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
      case RoomType.BASIC:
        // this will generate nothing but dirt

        this.tiles = []; // set up each row!
        for (let xStep = 0; xStep < sizeX; xStep++) {
          this.tiles[xStep] = []; // set up each column!
          for (let yStep = 0; yStep < sizeY; yStep++) {
            // these kinds of for loops are hell

            // create a new dirt tile
            this.setTile(xStep, yStep, new Tile(TileType.DIRT)); // assign that tile to a place in the world map
          }
        }
        break;
    }
  }

  // inserts an entity into the room
  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  // sets a specific file and checks to make sure its position is valid
  setTile(locX: number, locY: number, tile: Tile) {
    if (locX < this.sizeX && locX >= 0 && locY < this.sizeY && locY >= 0) {
      // make sure it's a valid tile!
      this.tiles[locX][locY] = undefined;
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
}

// location on map
interface Position {
  x: number;
  y: number;
}

// INITIALIZE GAME

let defaultRoom = new Room(RoomType.BASIC, 16, 16);
let defaultPlayer = new Player("Farmer", { x: 0, y: 0 });
// this will contain everything relevant to the current game
export let currentGame = new Game(
  defaultRoom,
  GameState.INITIALIZE,
  defaultPlayer
);

// we keep the rendering code separate so that it can easily be changed or reworked
startRender();
