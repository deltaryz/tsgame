// imports
import * as render from "./render"; // keep the rendering outside the game logic
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
      if (tileTarget != undefined)
        render.displayToastNotification("This is: " + tileTarget.getName());
      return true;
    },
    keyItem: true
  })
  .set(ITEM_TYPE.LIFESEED, {
    name: "Lifeseed",
    use: (entityTarget?: entity.Entity, tileTarget?: tile.Tile) => {
      if (tileTarget != undefined) {
        // user has clicked a tile
        if (tileTarget.getType() == tile.TILE_TYPE.DIRT) {
          // user has clicked dirt
          // let's put a lifebud there!
          let newLifebud = new entity.Entity(
            entity.ENTITY_TYPE.PLANT_LIFEBUD,
            tileTarget.getPosition()
          );
          game.currentGame.getCurrentRoom().addEntity(newLifebud); // add to the room

          game.currentGame
            .getCurrentPlayer()
            .getInventory()
            .removeItem(ITEM_TYPE.LIFESEED, 1);

          return true;
        } else {
          return false;
        }
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

  // does this item exist in the inventory?
  // returns the item if it exists
  getItem(itemType: ITEM_TYPE): Item {
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].getItemType() == itemType) {
        return this.items[index];
      }
    }

    return undefined;
  }

  // insert a new item into the inventory by instantiating it here
  // will not succeed if inventory is currently full
  // will increase amount of existing item if item is present
  // boolean represents success!
  createItem(name: string, quantity: number, type: ITEM_TYPE): boolean {
    // check if it already exists in the inventory
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].getItemType() == type) {
        this.items[index].setQuantity(
          this.items[index].getQuantity() + quantity
        );
        return true;
      }
    }

    // if we're still going the item does not exist

    if (this.items.length < this.capacity) {
      this.items.push(new Item(name, quantity, type));
      return true;
    } else {
      return false;
    }
  }

  // insert a new item directly
  // this will fail if a matching typed item already exists
  // boolean represents success
  insertItem(item: Item) {
    // check if it already exists in the inventory
    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].getItemType() == item.getItemType()) {
        return false; // cut off now, already exists!
      }
    }

    // item must not exist, continuing
    this.items.push(item);
  }

  // subtract an item's quantity by provided amount
  // will return false of operation was unsuccessful
  // if it reaches 0 it will destroy the item
  removeItem(itemType: ITEM_TYPE, amount: number): boolean {
    let itemObject: Item;

    this.items.forEach((item: Item) => {
      if (item.getItemType() == itemType) {
        itemObject = item;
      }
    });

    if (itemObject != undefined) {
      // this item does exist in the inventory!
      let itemAmount = itemObject.getQuantity();
      if (itemAmount >= amount) {
        // player has enough
        itemObject.setQuantity(itemObject.getQuantity() - amount); // subtract!
        itemAmount = itemObject.getQuantity(); // update this now
      }

      if (itemAmount <= 0) {
        // there are none left so we must destroy it
        let itemIndex = this.items.indexOf(itemObject);
        this.items.splice(itemIndex, 1);
      }

      return true;
    } else {
      return false;
    }
  }

  // returns array of contained items
  getContents(): Item[] {
    return this.items;
  }
}
