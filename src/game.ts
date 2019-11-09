// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

import { render } from "./render";

// keeps track of game state
class Game {
  private currentRoom: Room;
  private currentState: GameState;

  constructor(currentRoom: Room, currentState: GameState) {
    this.currentRoom = currentRoom;
    this.currentState = currentState;
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
}

enum GameState {
  INITIALIZE
}

// Player class
class Player {
  private name: string;
  private inventory: Item[];
  private position: Position;

  constructor(name: string, position: Position) {
    this.name = name;
    this.position = position;
  }
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
    return "TODO: item interactions";
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
class Entity {}

// Items in the world
class ItemEntity extends Entity {
  private item: Item;
  private position: Position;
}

// anything that can hold items will have this
class Inventory {
  private items: Item[];
  private capacity: number;

  addItem(item: Item): string {
    return "TODO: actual output";
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

    // which room type are we going to generate?
    switch (type) {
      case RoomType.BASIC:
        break;
    }
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }
}

// location on map
interface Position {
  x: number;
  y: number;
}

// INITIALIZE GAME

let defaultRoom = new Room(RoomType.BASIC, 16, 16);
export let currentGame = new Game(defaultRoom, GameState.INITIALIZE);

render();
