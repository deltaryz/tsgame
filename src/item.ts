// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as game from "./game"; // everything item related!
import * as entity from "./entity"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

// Item class

// this contains metadata of what an item is/does
export interface ItemData {
  name: string;
  use(entityTarget?: entity.Entity, tileTarget?: tile.Tile): boolean; // returns whether or not the action was successful
  keyItem: boolean; // key items get special behavior
}

// Item registry
// This matches ITEM_TYPE keys with ItemData values
// Use itemRegistry.get(ITEM_TYPE) to access items!
export let itemRegistry = new Map<ITEM_TYPE, ItemData>();

// Item types
// These are used to identify specific types of items
export enum ITEM_TYPE {
  HANDS = "HANDS",
  LIFESEED = "LIFESEED"
}

// Here we define the item metadata and behavior
itemRegistry
  .set(ITEM_TYPE.HANDS, {
    name: "Hands",
    use: (entityTarget?: entity.Entity, tileTarget?: tile.Tile) => {
      if (entityTarget != undefined) entityTarget.onClick(); // hands will directly call the entity's onClick
      if (tileTarget != undefined) console.log(tileTarget.getName());
      return true;
    },
    keyItem: true
  })
  .set(ITEM_TYPE.LIFESEED, {
    name: "Lifeseed",
    use: (entityTarget?: entity.Entity, tileTarget?: tile.Tile) => {
      if (tileTarget != undefined) {
        return true;
      } else {
        return false;
      }
    },
    keyItem: false
  });

// TODO: Using an item should always check to make sure the item actually exists in your inventory!
export class Item {
  private displayName: string;
  private type: ITEM_TYPE;
  private quantity: number;

  // item names are not the same thing as the item type!
  constructor(name: string, quantity: number, type: ITEM_TYPE) {
    console.log("Generating new item with name " + name);
    this.displayName = name;
    this.quantity = quantity;
    this.type = type;
  }

  // returns a description of the item
  public inspect(target: entity.Entity): String {
    return "TODO: item inspection";
  }

  // returns the name of the item
  public getDisplayName(): string {
    return this.displayName;
  }

  // sets the name of the item
  public setDisplayName(name: string) {
    this.displayName = name;
  }

  // is this a key item?
  public isKeyItem(): boolean {
    return itemRegistry.get(this.type).keyItem;
  }

  // how many of this item?
  public getQuantity(): number {
    return this.quantity;
  }

  // set how many there are
  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  // get the ITEM_TYPE of what item this is
  public getItemType(): ITEM_TYPE {
    return this.type;
  }

  // get the ItemData of what item this is
  public getItemData(): ItemData {
    return itemRegistry.get(this.type);
  }

  // what should we do when this item is used?
  // returns whether the action was successful
  public useItem(
    entityTarget?: entity.Entity,
    tileTarget?: tile.Tile
  ): boolean {
    return itemRegistry.get(this.type).use(entityTarget, tileTarget);
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
