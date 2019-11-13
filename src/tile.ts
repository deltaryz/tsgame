// imports
import * as render from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as entity from "./entity"; // everything entity related!
import * as room from "./room"; // everything room related!

// Tile class

// this contains the metadata of what the tile is/does
export interface TileData {
  name: string;
}

// Tile registry
// This matches the TILE_TYPE with TileData values
// use tileRegistry.get(TILE_TYPE) to access metadata!
export let tileRegistry = new Map<TILE_TYPE, TileData>();

// represents which types of tile can exist
export enum TILE_TYPE {
  DIRT = "DIRT",
  STONE = "STONE",
  WATER = "WATER"
}

// here we define tile metadata and behavior
tileRegistry
  .set(TILE_TYPE.DIRT, {
    name: "Dirt"
  })
  .set(TILE_TYPE.STONE, {
    name: "Stone"
  })
  .set(TILE_TYPE.WATER, {
    name: "Water"
  });

// tiles occupy single coordinates of world space
export class Tile {
  private type: TILE_TYPE;
  private position: game.Position;

  constructor(type: TILE_TYPE, position: game.Position) {
    console.log("Generating new tile of type " + type);
    this.type = type;
    this.position = position;
  }

  // returns the type of tile this is
  getType(): TILE_TYPE {
    return this.type;
  }

  // changes the type of the tile
  setType(type: TILE_TYPE) {
    this.type = type;
  }

  // returns tile's position (this is read only!)
  getPosition(): game.Position {
    return this.position;
  }

  // returns the name of a tile
  getName(): string {
    return tileRegistry.get(this.getType()).name;
  }
}
