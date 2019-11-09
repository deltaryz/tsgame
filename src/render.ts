///<reference types="pixi.js"/>
// handles all rendering and visual output
// this is deliberately kept separate from internal game logic

import * as PIXI from "pixi.js";

export const app = new PIXI.Application({ width: 256, height: 256 });

app.loader.add("assets/dirt.png").load(setup);

function setup() {
  //app.stage.addChild(referenceTileDirt.texture);
}

export function render() {
  document.body.appendChild(app.view);
}
