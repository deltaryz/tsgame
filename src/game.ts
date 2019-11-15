// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

// imports
import * as render from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as entity from "./entity"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

export let currentGame: Game; // this will be used to reference anything relating too the current game state
let tickInterval = 2000; // interval (in milliseconds) of 1 game tick

// what it says on the tin
export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// keeps track of game state
class Game {
  private currentRoom: room.Room;
  private currentState: GAME_STATE;
  private currentPlayer: entity.Player;
  private tickInterval: number;
  private tickIntervalID: NodeJS.Timeout;

  // we initialize each of these components separately from the gamestate initialization
  // this makes it easier to swap them on the fly!
  constructor(
    currentRoom: room.Room,
    currentState: GAME_STATE,
    currentPlayer: entity.Player,
    tickInterval: number
  ) {
    console.log("Game being initialized!");
    this.currentRoom = currentRoom;
    this.currentState = currentState;
    this.currentPlayer = currentPlayer;
    this.tickInterval = tickInterval;
  }

  // this is triggered every time the game ticks
  tick() {
    console.log("Tick has passed");

    // trigger the tick functions of all existing entities
    this.currentRoom.getEntities().forEach((thisEntity: entity.Entity) => {
      let tickFunction = thisEntity.getTick();
      if (tickFunction != undefined) tickFunction(thisEntity);
    });
    render.render();
  }

  // initializes tick and sets game state
  startGame() {
    console.log("Starting game!");
    this.currentState = GAME_STATE.GAMEPLAY;
    this.tickIntervalID = setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }

  // kills the tick and sets game state
  pauseGame() {
    console.log("Pausing game!");
    this.currentState = GAME_STATE.PAUSE;
    clearInterval(this.tickIntervalID);
  }

  // toggles game state between PAUSE and GAMEPLAY
  togglePause() {
    if (this.currentState == GAME_STATE.PAUSE) {
      this.startGame();
    } else if (this.currentState == GAME_STATE.GAMEPLAY) {
      this.pauseGame();
    }
  }

  // returns the current room
  getCurrentRoom(): room.Room {
    return this.currentRoom;
  }

  // sets the current room
  setCurrentRoom(newRoom: room.Room) {
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
  getCurrentPlayer(): entity.Player {
    return this.currentPlayer;
  }

  // sets the current Player
  setCurrentPlayer(player: entity.Player) {
    console.log("Setting player to " + player.getName());
    this.currentPlayer = player;
  }
}

// represents what state the game is currently in
enum GAME_STATE {
  INITIALIZE = "INITIALIZE",
  PAUSE = "PAUSE",
  GAMEPLAY = "GAMEPLAY"
}

// location on map
export interface Position {
  x: number;
  y: number;
}

// INITIALIZE GAME

let defaultRoom = new room.Room(room.ROOM_TYPE.BASIC, 16, 16);
let defaultPlayer = new entity.Player("Farmer");

// spawn 1 lifebud to get the game started
let defaultLifebud = new entity.Entity(
  entity.ENTITY_TYPE.PLANT_LIFEBUD,
  defaultRoom.getRandomUnoccupiedPositionInRoom()
);
defaultRoom.addEntity(defaultLifebud);

// spawn 1 stone just so it's there
let defaultStone = new entity.Entity(
  entity.ENTITY_TYPE.OBJECT_STONE,
  defaultRoom.getRandomUnoccupiedPositionInRoom()
);
defaultRoom.addEntity(defaultStone);

// clear out the placeholder entities sincec we don't need those anymore
defaultRoom.clearPlaceholders();

// this will contain everything relevant to the current game
currentGame = new Game(
  defaultRoom,
  GAME_STATE.INITIALIZE,
  defaultPlayer,
  tickInterval
);

// we keep the rendering code separate so that it can easily be changed or reworked
// render the game after 2 seconds to make sure the basic stuff is present
setTimeout(render.render, 2000);

// make sure we wait for pixi to load its assets
let waitForPixi = setInterval(() => {
  if (render.ready == true) {
    clearInterval(waitForPixi);
    currentGame.startGame();
  }
}, 1000);
