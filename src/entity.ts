// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

// Entity class

// textures for entities!
export enum ENTITY_TYPE {
  PLANT_LIFEBUD = "PLANT_LIFEBUD",
  OBJECT_STONE = "OBJECT_STONE"
}

// Entity class
// Any object in the world that is not a tile
export class Entity {
  private inventory: item.Inventory; // all entities can have inventories
  private position: game.Position;
  private texture: ENTITY_TYPE;

  constructor(
    position?: game.Position,
    inventoryItems?: item.Item[],
    texture?: ENTITY_TYPE
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
  getTexture(): ENTITY_TYPE {
    return this.texture;
  }

  // set the visible texture of an entity
  setTexture(texture: ENTITY_TYPE) {
    this.texture = texture;
  }

  // returns the entity's inventory
  getInventory(): item.Inventory {
    return this.inventory;
  }

  // completely wipes a user's inventory
  setInventory(inv: item.Inventory) {
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
export enum PLANT_TYPE {
  LIFEBUD = "LIFEBUD"
}

// Plant item
export class Plant extends Entity {
  private type: PLANT_TYPE;

  constructor(type: PLANT_TYPE, position?: game.Position) {
    super(position);
    console.log("Plant of type " + type);
    switch (type) {
      case PLANT_TYPE.LIFEBUD:
        this.setTexture(ENTITY_TYPE.PLANT_LIFEBUD);
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
        game.currentGame.getCurrentRoom().removeEntity(this);
        game.currentGame
          .getCurrentPlayer()
          .getInventory()
          .addItem(new item.Item("Lifeseed", 1, item.ITEM_TYPE.LIFESEED));
        break;
    }

    // TODO: pick up item and place into inventory
    render(); // make sure the user sees our changes
  };
}

// Items in the world
export class ItemEntity extends Entity {
  private item: item.Item;

  constructor(position?: game.Position) {
    super(position);
    console.log("This is an ItemEntity");
  }
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
    super(position, inventoryItems);
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
