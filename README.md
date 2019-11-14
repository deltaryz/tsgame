# tsgame

TSGame is a TypeScript/PIXI.JS game. Not much has happened yet.

The build process utilizes Webpack to combine all code & dependencies into the resulting files `dist/bundle.js`, and `dist/index.html`. It will also copy the `src/assets` directory to `dist/assets`.

There is a live build running at [snuggle.monster](https://snuggle.monster/).

## Building

Clone the repo and run `npm install`.

`npm run-script build` will generate the website in the `dist/` directory, and monitor the `src/` directory for changes (it will auto-compile if the files are modified). Use Ctrl-C to cancel.
