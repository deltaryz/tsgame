// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as game from "./game"; // everything item related!
import * as entity from "./entity"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

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
  inspect(target: entity.Entity): String {
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
  public useItem(entityTarget?: entity.Entity, tileTarget?: tile.Tile) {
    // items can be used
  }
}

// special tools that the user cannot remove
export class KeyItem extends Item {
  constructor(name: string, quantity: number) {
    super(name, quantity);
    console.log("This is a key item!");
    super.setDroppable(false); // we set this automatically!
  }
}

// anything that can contain items will have this
export class Inventory {
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
