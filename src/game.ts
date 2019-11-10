// created by deltaryz
// https://github.com/techniponi
// Twitter: @deltaryz

// made with typescript

// imports
import { render } from "./render"; // keep the rendering outside the game logic
import * as item from "./item"; // everything item related!
import * as entity from "./entity"; // everything entity related!
import * as tile from "./tile"; // everything tile related!
import * as room from "./room"; // everything room related!

export let currentGame: Game; // this will be used to reference anything relating to the current game state

// what it says on the tin
function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

// keeps track of game state
class Game {
  private currentRoom: room.Room;
  private currentState: GAME_STATE;
  private currentPlayer: entity.Player;

  // we initialize each of these components separately from the gamestate initialization
  // this makes it easier to swap them on the fly!
  constructor(
    currentRoom: room.Room,
    currentState: GAME_STATE,
    currentPlayer: entity.Player
  ) {
    console.log("Game being initialized!");
    this.currentRoom = currentRoom;
    this.currentState = currentState;
    this.currentPlayer = currentPlayer;
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
  MENU = "MENU",
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

let defaultLifebud = new entity.Plant(
  entity.PLANT_TYPE.LIFEBUD,
  getRandomPositionInRoom(defaultRoom)
);
defaultRoom.addEntity(defaultLifebud);
// this will contain everything relevant to the current game
currentGame = new Game(defaultRoom, GAME_STATE.INITIALIZE, defaultPlayer);

// we keep the rendering code separate so that it can easily be changed or reworked
// render the game after 2 seconds to make sure the basic stuff is present
setTimeout(render, 2000);

function getRandomPositionInRoom(room: room.Room): Position {
  let xPos = getRandomIntInclusive(0, room.getRoomSize()[0] - 1);
  let yPos = getRandomIntInclusive(0, room.getRoomSize()[1] - 1);

  console.log("Random position generated: " + xPos + " " + yPos);
  return { x: xPos, y: yPos };
}

setTimeout(function() {
  currentGame.setCurrentState(GAME_STATE.GAMEPLAY);
}, 2000);
