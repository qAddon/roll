# qRoll - Displays an overview about player random rolls

This repository contains the sourcecode for the World of Warcraft Classic addon qRoll.

## Installation

**Prerequisites**: You must install [Node.js](https://nodejs.org) on your system.

Clone this repository and execute the following commands within the project directory:

- `npm install` *This will install all dependencies to successfully build the addon*
- `npm start` *Transpiles the addon into lua and create a corresponding TOC file*

After running those commands, a `dist` folder has been created within the project root. This folder
contains the transpiled source code. Copy the dist folder into the `Interface/Addons` folder and rename the
folder to `qRoll`.

Start the game client. You should see the addon within the list of installed addons.

## Some notes

I developed this addon to create a showcase of how addon development can be done using Typescript
and [qhun-transpiler](https://github.com/wartoshika/qhun-transpiler). A wide range of [features](https://github.com/wartoshika/qhun-transpiler/blob/master/doc/lua.md) are used within this addon
and should give a hint of how you can write your own Typescript addon!

Please feel free to contribute changes or ideas to the transpilers repository or this one. 