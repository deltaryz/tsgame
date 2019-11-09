// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

import { render } from "./render";
import { ready } from "./render";

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

  getCurrentRoom(): Room {
    return this.currentRoom;
  }

  setCurrentRoom(newRoom: Room) {
    this.currentRoom = newRoom;
  }

  getCurrentState(): GameState {
    return this.currentState;
  }

  setCurrentState(newState: GameState) {
    this.currentState = newState;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  setCurrentPlayer(player: Player) {
    this.currentPlayer = player;
  }
}

enum GameState {
  INITIALIZE
}

// Item class
class Item {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string) {
    this.name = name;
  }

  inspect(target: Entity): String {
    return "TODO: item inspection";
  }
}

enum TileType {
  DIRT
}

class Tile {
  private type: TileType;

  constructor(type: TileType) {
    this.type = type;
  }
}

// Entity class
class Entity {
  private inventory: Item[];
  private position: Position;

  constructor(position?: Position) {
    if (!position == undefined) {
      this.position = position;
    }
  }
}

// Items in the world
class ItemEntity extends Entity {
  private item: Item;

  constructor(position?: Position) {
    if (position == undefined) {
      super();
    } else {
      super(position);
    }
  }
}

// Player class
class Player extends Entity {
  private name: string;

  constructor(name: string, position?: Position) {
    if (position == undefined) {
      super();
    } else {
      super(position);
    }

    this.name = name;
  }
}

// anything that can contain items will have this
class Inventory {
  private items: Item[];
  private capacity: number;

  // insert an item into the inventory
  addItem(item: Item): string {
    return "TODO: add items to inventories";
  }
}

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
        "Something attempted to place a tile at " +
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
function draw() {
  setTimeout(function() {
    requestAnimationFrame(draw);
    render();
  }, 1000 / 30);
}
draw();
