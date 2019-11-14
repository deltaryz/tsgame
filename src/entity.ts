// imports
import * as render from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as game from "./game"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

// TODO: plant growth should have a consistent speed that scales according to the tick rate

// Entity class

// this contains metadata of what an entity is/does
export interface EntityData {
  name: string;
  onClick(entity: Entity): void; // what happens when we click the entity with our bare Hands x 1?
  metaType: ENTITY_META_TYPE;
  tick?(entity: Entity): void; // what should this entity do when the game ticks?
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
  OBJECT_STONE = "OBJECT_STONE",
  PLACEHOLDER = "PLACEHOLDER" // we use this to hold space for non-entity objects that need unique positions
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
      render.displayToastNotification(
        "how did you even activate this??? (player was clicked)"
      ); // this should theoretically never get called
    },
    metaType: ENTITY_META_TYPE.DEFAULT
  })
  .set(ENTITY_TYPE.ITEM_ENTITY, {
    name: "Item",
    onClick: (entity: Entity) => {
      // TODO: pick up items
      return false;
    },
    metaType: ENTITY_META_TYPE.DEFAULT
  })
  .set(ENTITY_TYPE.PLANT_LIFEBUD, {
    name: "Lifebud",
    onClick: (entity: Entity) => {
      if (entity.getGrowth() == 100) {
        let result = game.currentGame
          .getCurrentPlayer()
          .getInventory()
          .createItem("Lifeseed", 3, item.ITEM_TYPE.LIFESEED);

        if (result == true) {
          // item creation was a success
          render.displayToastNotification(
            "You harvested the Lifebud and obtained seeds."
          );
          game.currentGame.getCurrentRoom().removeEntity(entity);
        } else {
          render.displayToastNotification("You don't have inventory space!");
        }
      } else {
        render.displayToastNotification(
          "This Lifebud is not ready to harvest yet. (Growth: " +
            entity.getGrowth() +
            "%, Moisture: " +
            entity.getMoisture() +
            "%)"
        );
      }
    },
    metaType: ENTITY_META_TYPE.PLANT,
    tick: (entity: Entity) => {
      // this plant might grow a little every tick!

      // growth will require 10% moisture per turn
      if (entity.getMoisture() >= 10) {
        entity.setMoisture(entity.getMoisture() - 10);
        // TODO: show number thing for moisture value changes / growth
        entity.grow(25);
      }
    }
  })
  .set(ENTITY_TYPE.OBJECT_STONE, {
    name: "Stone",
    onClick: (entity: Entity) => {
      render.displayToastNotification(
        "The " + entity.getDisplayName() + " is too heavy to move."
      );
    },
    metaType: ENTITY_META_TYPE.OBJECT
  })
  .set(ENTITY_TYPE.PLACEHOLDER, {
    name: "Placeholder",
    onClick: () => {},
    metaType: ENTITY_META_TYPE.DEFAULT
  });

// Entity class
// Any object in the world that is not a tile
export class Entity {
  private inventory: item.Inventory; // all entities can have inventories
  private position: game.Position;
  private type: ENTITY_TYPE;
  private metaType: ENTITY_META_TYPE;
  private displayName: string;
  private visible: boolean; // can we see it? - it will not be interactable by the player if this is true
  private growth: number; // only relevant for plants, defines growth percentage out of 100
  private moisture: number; // only relevant for plants, defines how much water the plant has absorbed

  constructor(
    type: ENTITY_TYPE,
    position?: game.Position,
    inventoryItems?: item.Item[],
    name?: string,
    visible?: boolean,
    growth?: number,
    moisture?: number
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
    this.metaType = entityRegistry.get(type).metaType;

    if (name != undefined) {
      this.displayName = name;
    } else {
      this.displayName = entityRegistry.get(type).name;
    }

    this.inventory = new item.Inventory(inventoryItems);

    if (visible != undefined) {
      this.visible = visible;
    } else {
      this.visible = true;
    }

    if (growth != undefined) {
      this.growth = growth;
    } else {
      if (entityRegistry.get(type).metaType == ENTITY_META_TYPE.PLANT) {
        // this is some sort of plant, set growth to 0
        this.growth = 0;
      } else {
        // we use -1 to represent something with no growth value
        this.growth = -1;
      }
    }

    if (moisture != undefined) {
      this.moisture = moisture;
    } else {
      if (entityRegistry.get(type).metaType == ENTITY_META_TYPE.PLANT) {
        // this is some sort of plant, set it to 0
        this.moisture = 0;
      } else {
        // we use -1 to represent something with no moisture value
        this.moisture = -1;
      }
    }
  }

  // get position of the entity
  getPosition(): game.Position {
    return this.position;
  }

  // sets position of an entity
  setPosition(pos: game.Position) {
    this.position = pos;
  }

  // get the type of an entity
  getType(): ENTITY_TYPE {
    return this.type;
  }

  // gets the metaType of an entity
  getMetaType(): ENTITY_META_TYPE {
    return this.metaType;
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

  // returns visibility
  getVisibility(): boolean {
    return this.visible;
  }

  // sets visibility
  setVisibility(vis: boolean) {
    this.visible = vis;
  }

  // get growth value
  getGrowth(): number {
    return this.growth;
  }

  // set growth value
  setGrowth(growth: number) {
    this.growth = growth;
  }

  // grow by provided value
  grow(amount: number) {
    if (this.growth < 100 && this.growth + amount >= 100) {
      // only display this on the tick in which it grows!
      this.growth = 100;

      // the plant is fully grown!
      // TODO: change this to a number thing
      render.displayToastNotification(
        "A " + this.getDisplayName() + " has fully grown!"
      );
    } else {
      if (this.growth < 100) {
        this.growth += amount;
      } else {
        this.growth = 100;
      }
    }
  }

  // returns the moisture
  getMoisture(): number {
    return this.moisture;
  }

  // sets the moisture
  setMoisture(moisture: number) {
    this.moisture = moisture;
  }

  // returns the tick function for this entity
  getTick() {
    return entityRegistry.get(this.type).tick;
  }

  // what should we do when this entity is clicked?
  public onClick = () => {
    console.log("An entity was clicked!");
    entityRegistry.get(this.getType()).onClick(this);
    render.render();
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
    let defaultWaterBottles = new item.Item(
      "Water Bottle",
      3,
      item.ITEM_TYPE.WATER_BOTTLE
    );
    this.getInventory().insertItem(defaultHands);
    this.getInventory().insertItem(defaultWaterBottles);
    this.selectedItem = defaultHands; // this represents nothing
  }

  // returns the selected tile type
  getSelectedItem(): item.Item {
    // go ahead and do a check to make sure that we actually have this item!
    if (
      this.getInventory().getItem(this.selectedItem.getItemType()) == undefined
    ) {
      console.log("We don't have the item that is currently selected!");
      // we don't!
      this.setSelectedItem(item.ITEM_TYPE.HANDS);
    }
    return this.selectedItem;
  }

  // sets the selected item type
  // returns false if the player doesn't have one!
  setSelectedItem(itemType: item.ITEM_TYPE): boolean {
    // check if we have the item
    let item = this.getInventory().getItem(itemType);
    if (item != undefined) {
      // player does have this item!
      console.log("Player's selected item set to " + item.getDisplayName());
      this.selectedItem = item;
      render.render(); // make sure the user sees it!
      return true;
    } else {
      // we do not have this item
      return false;
    }
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
