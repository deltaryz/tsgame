// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

import { render } from "./render"; // keep the rendering outside the game logic

export let currentGame: Game; // this will be used to reference anything relating to the current game state

// what it says on the tin
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

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
    console.log("Game being initialized!");
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
// TODO: Using an item should always check to make sure the item actually exists in your inventory!
export class Item {
  private name: string;
  private droppable: boolean;
  private quantity: number;

  // item names are not the same thing as the item type!
  constructor(name: string, quantity: number) {
    console.log("Generating new item with name " + name);
    this.name = name;
    this.droppable = true; // we assume this to be default for most items
    this.quantity = quantity;
  }

  // returns a description of the item
  inspect(target: Entity): String {
    return "TODO: item inspection";
  }

  // returns the name of the item
  getName(): string {
    return this.name;
  }

  // sets the name of the item
  setName(name: string) {
    this.name = name;
  }

  // can this item be dropped?
  isDroppable(): boolean {
    return this.droppable;
  }

  // set whether the item can be dropped
  setDroppable(droppable: boolean) {
    this.droppable = droppable;
  }

  // how many of this item?
  getQuantity(): number {
    return this.quantity;
  }

  // set how many there are
  setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  // what should we do when this item is used?
  // this should be overridden by extending classes
  // override with onClick = () => { ... }
  public useItem(entityTarget?: Entity, tileTarget?: Tile) {
    // items can be used
  }
}

// special tools that the user cannot remove
class KeyItem extends Item {
  constructor(name: string, quantity: number) {
    super(name, quantity);
    console.log("This is a key item!");
    super.setDroppable(false); // we set this automatically!
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

// textures for entities!
export enum ENTITY_TEXTURE {
  PLANT_LIFEBUD = "PLANT_LIFEBUD",
  OBJECT_STONE = "OBJECT_STONE"
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
    let outputPosX: number = 0; // assume 0 if nothign else is given
    let outputPosY: number = 0;
    if (position != undefined) {
      outputPosX = position.x;
      outputPosY = position.y;
    }
    console.log(
      "Generating new entity!\nPosition: " +
        outputPosX +
        "," +
        outputPosY +
        "\ninventoryItems: " +
        inventoryItems +
        "\nTexture: " +
        texture
    );

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

  // sets position of an entity
  setPosition(pos: Position) {
    this.position = pos;
  }

  // get the selected texture of an entity
  getTexture(): ENTITY_TEXTURE {
    return this.texture;
  }

  // set the visible texture of an entity
  setTexture(texture: ENTITY_TEXTURE) {
    this.texture = texture;
  }

  // returns the entity's inventory
  getInventory(): Inventory {
    return this.inventory;
  }

  // completely wipes a user's inventory
  setInventory(inv: Inventory) {
    this.inventory = inv;
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
  LIFEBUD = "LIFEBUD"
}

// Plant item
class Plant extends Entity {
  private type: PLANT_TYPE;

  constructor(type: PLANT_TYPE, position?: Position) {
    super(position);
    console.log("Plant of type " + type);
    switch (type) {
      case PLANT_TYPE.LIFEBUD:
        this.setTexture(ENTITY_TEXTURE.PLANT_LIFEBUD);
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

    // what kind of plant has the user clicked?
    switch (this.getType()) {
      case PLANT_TYPE.LIFEBUD:
        currentGame.getCurrentRoom().removeEntity(this);
        currentGame
          .getCurrentPlayer()
          .getInventory()
          .addItem(new Item("Lifeseed", 1));
        break;
    }

    // TODO: pick up item and place into inventory
    render(); // make sure the user sees our changes
  };
}

// Items in the world
class ItemEntity extends Entity {
  private item: Item;

  constructor(position?: Position) {
    super(position);
    console.log("This is an ItemEntity");
  }
}

// Player class
// even though this is an Entity, it isn't actually rendered in the world! Position is irrelevant.
class Player extends Entity {
  private name: string;
  private selectedItem: Item;

  constructor(name: string, position?: Position, inventoryItems?: Item[]) {
    super(position, inventoryItems);
    console.log("This was the player!\nName: " + name);
    this.name = name;

    // initialize inventory
    let defaultHands = new KeyItem("Hands", 1);
    this.getInventory().addItem(defaultHands);
    this.selectedItem = defaultHands; // this represents nothing
  }

  // returns the selected tile type
  getSelectedItem(): Item {
    return this.selectedItem;
  }

  // sets the selected tile type
  setSelectedItem(item: Item) {
    console.log("Player's selected item set to " + item.getName());
    this.selectedItem = item;
    render(); // make sure the user sees it!
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

  constructor(items?: Item[], capacity?: number) {
    console.log("Generating a new inventory with items " + items);
    if (items != undefined) {
      this.items = items;
    } else {
      this.items = [];
    }

    if (capacity != undefined) {
      this.capacity = capacity;
    } else {
      this.capacity = 3; // default inventory size is 3!
    }
  }

  // insert an item into the inventory
  // boolean represents success!
  addItem(item: Item): boolean {
    if (this.items.length < this.capacity) {
      this.items.push(item);
      return true;
    } else {
      return false;
    }
    // TODO: make sure we don't exceed capacity
  }

  // returns array of contained items
  getContents(): Item[] {
    return this.items;
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

  // removes a specific entity from the room
  removeEntity(entity: Entity) {
    var index = this.getEntities().indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
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
  getRoomSize(): number[] {
    return [this.sizeX, this.sizeY];
  }
}

// location on map
interface Position {
  x: number;
  y: number;
}

// INITIALIZE GAME

let defaultRoom = new Room(ROOM_TYPE.BASIC, 16, 16);
let defaultPlayer = new Player("Farmer");

let defaultLifebud = new Plant(
  PLANT_TYPE.LIFEBUD,
  getRandomPositionInRoom(defaultRoom)
);
defaultRoom.addEntity(defaultLifebud);
// this will contain everything relevant to the current game
currentGame = new Game(defaultRoom, GAME_STATE.INITIALIZE, defaultPlayer);

// we keep the rendering code separate so that it can easily be changed or reworked
// render the game after 2 seconds to make sure the basic stuff is present
setTimeout(render, 2000);

function getRandomPositionInRoom(room: Room): Position {
  let xPos = getRandomIntInclusive(0, room.getRoomSize()[0] - 1);
  let yPos = getRandomIntInclusive(0, room.getRoomSize()[1] - 1);

  console.log("Random position generated: " + xPos + " " + yPos);
  return { x: xPos, y: yPos };
}

setTimeout(function() {
  currentGame.setCurrentState(GAME_STATE.GAMEPLAY);
}, 2000);
