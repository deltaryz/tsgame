// imports

// Room class
import * as render from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as entity from "./entity"; // everything entity related!
import * as tile from "./tile"; // everything tile related!

// Different room types will generate different terrain
export enum ROOM_TYPE {
  BASIC = "BASIC"
}

// the world map
export class Room {
  private entities: entity.Entity[];
  private tiles: tile.Tile[][];
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
            this.setTile(xStep, yStep, new tile.Tile(tile.TILE_TYPE.DIRT)); // assign that tile to a place in the world map
          }
        }
        break;
    }
  }

  // inserts an entity into the room
  addEntity(entity: entity.Entity) {
    this.entities.push(entity);
  }

  // returns list of all entities
  getEntities(): entity.Entity[] {
    return this.entities;
  }

  // removes a specific entity from the room
  removeEntity(entity: entity.Entity) {
    var index = this.getEntities().indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }

  // sets a specific file and checks to make sure its position is valid
  setTile(locX: number, locY: number, tile: tile.Tile) {
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
  getTileMap(): tile.Tile[][] {
    return this.tiles;
  }

  // returns the size of the room
  getRoomSize(): number[] {
    return [this.sizeX, this.sizeY];
  }
}
