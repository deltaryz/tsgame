// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as entity from "./entity"; // everything entity related!
import * as room from "./room"; // everything room related!

// Tile class

// represents which types of tile can exist
export enum TILE_TYPE {
  DIRT = "DIRT",
  STONE = "STONE",
  WATER = "WATER"
}

// tiles occupy single coordinates of world space
export class Tile {
  private type: TILE_TYPE;

  constructor(type: TILE_TYPE) {
    console.log("Generating new tile of type " + type);
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
    // update the screen to represent any changes
    render();
  };
}
