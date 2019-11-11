// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

// Entity class

// this contains metadata of what an entity is/does
export interface EntityData {
  name: string;
  onClick(entity: Entity): void; // what happens when we click the entity?
  metaType: ENTITY_META_TYPE;
}

// Entity registry
// This matches the ENTITY_TYPE with EntityData values
// use entityRegistry.get(ENTITY_TYPE) to access entities!
export let entityRegistry = new Map<ENTITY_TYPE, EntityData>();

// types of entities!
export enum ENTITY_TYPE {
  PLAYER = "PLAYER", // this one is special
  ITEM_ENTITY = "ITEM_ENTITY",
  PLANT_LIFEBUD = "PLANT_LIFEBUD",
  OBJECT_STONE = "OBJECT_STONE"
}

// these are used for more generic identification
export enum ENTITY_META_TYPE {
  DEFAULT = "DEFAULT", // nothing specific
  PLANT = "PLANT",
  OBJECT = "OBJECT"
}

// Here we define entity metadata and behavior
entityRegistry
  .set(ENTITY_TYPE.PLAYER, {
    name: "Player",
    onClick: (entity: Entity) => {
      console.log("how did you even activate this??? (player was clicked)"); // this should theoretically never get called
    },
    metaType: ENTITY_META_TYPE.DEFAULT
  })
  .set(ENTITY_TYPE.ITEM_ENTITY, {
    name: "Item",
    onClick: (entity: Entity) => {
      // TODO: pick up items
    },
    metaType: ENTITY_META_TYPE.DEFAULT
  })
  .set(ENTITY_TYPE.PLANT_LIFEBUD, {
    name: "Lifebud",
    onClick: (entity: Entity) => {
      console.log("A " + entity.getType() + " was clicked!");

      game.currentGame.getCurrentRoom().removeEntity(entity);
      game.currentGame
        .getCurrentPlayer()
        .getInventory()
        .addItem(new item.Item("Lifeseed", 1, item.ITEM_TYPE.LIFESEED));
    },
    metaType: ENTITY_META_TYPE.PLANT
  })
  .set(ENTITY_TYPE.OBJECT_STONE, {
    name: "Stone",
    onClick: (entity: Entity) => {
      // TODO: stone interaction
    },
    metaType: ENTITY_META_TYPE.OBJECT
  });

// Entity class
// Any object in the world that is not a tile
export class Entity {
  private inventory: item.Inventory; // all entities can have inventories
  private position: game.Position;
  private type: ENTITY_TYPE;
  private displayName: string;

  constructor(
    type: ENTITY_TYPE,
    position?: game.Position,
    inventoryItems?: item.Item[],
    name?: string
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
        "\nType: " +
        type
    );

    if (position != undefined) {
      this.position = position;
    } else {
      this.position = { x: 0, y: 0 };
    }

    this.type = type;

    if (name != undefined) {
      this.displayName = name;
    } else {
      this.displayName = type;
    }

    this.inventory = new item.Inventory(inventoryItems);
  }

  // get position of the entity
  getPosition(): game.Position {
    return this.position;
  }

  // sets position of an entity
  setPosition(pos: game.Position) {
    this.position = pos;
  }

  // get the selected texture of an entity
  getType(): ENTITY_TYPE {
    return this.type;
  }

  // set the visible texture of an entity
  setType(texture: ENTITY_TYPE) {
    this.type = texture;
  }

  // returns the entity's inventory
  getInventory(): item.Inventory {
    return this.inventory;
  }

  // completely wipes a user's inventory
  setInventory(inv: item.Inventory) {
    this.inventory = inv;
  }

  // returns display name
  getDisplayName(): string {
    return this.displayName;
  }

  // sets display name
  setDisplayName(name: string) {
    this.displayName = name;
  }

  // what should we do when this entity is clicked?
  public onClick = () => {
    console.log("An entity was clicked!");
    entityRegistry.get(this.getType()).onClick(this);
    render();
  };
}

// Player class
// even though this is an Entity, it isn't actually rendered in the world! Position is irrelevant.
export class Player extends Entity {
  private name: string;
  private selectedItem: item.Item;

  constructor(
    name: string,
    position?: game.Position,
    inventoryItems?: item.Item[]
  ) {
    super(ENTITY_TYPE.PLAYER, position, inventoryItems);
    console.log("This was the player!\nName: " + name);
    this.name = name;

    // initialize inventory
    let defaultHands = new item.Item("Hands", 1, item.ITEM_TYPE.HANDS);
    this.getInventory().addItem(defaultHands);
    this.selectedItem = defaultHands; // this represents nothing
  }

  // returns the selected tile type
  getSelectedItem(): item.Item {
    return this.selectedItem;
  }

  // sets the selected tile type
  setSelectedItem(item: item.Item) {
    console.log("Player's selected item set to " + item.getDisplayName());
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
