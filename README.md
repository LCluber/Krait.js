## Synopsis

Krait.js is a key bindings library written in TypeScript with multiple keystroke detection.

## Motivation

The purpose of this library is to provide a simple and easy to use key binding declaration.

## Installation

### npm

```bash
$ npm install @lcluber/kraitjs
```

### Yarn

```bash
$ yarn add @lcluber/kraitjs
```

## Usage

### ES6

```javascript
import { Keyboard } from "@lcluber/kraitjs";

let keyboard = new Keyboard();

keyboard.addCommand("group1", "action0", null, [32], action0, {
  preventDefault: true
});
keyboard.addCommand("group1", "action1", { ctrl: true }, ["G"], action1, null);
// set another key for action1
keyboard.setInputs(
  "group1",
  "action1",
  { ctrl: false, alt: false, shift: false },
  ["Z", "T"]
);
// Enable group1 commands
keyboard.watch("group1");

function action0(isKeyDown) {
  if (isKeyDown) {
    // do something;
  }
}

function action1(isKeyDown) {
  if (isKeyDown) {
    // do something;
  }
}
```

### IIFE

```javascript
var keyboard = new Krait.Keyboard();

keyboard.addCommand("group1", "action0", null, [32], action0, {
  preventDefault: true
});
keyboard.addCommand("group1", "action1", { ctrl: true }, ["G"], action1, null);
// set another key for action1
keyboard.setInputs(
  "group1",
  "action1",
  { ctrl: false, alt: false, shift: false },
  ["Z", "T"]
);
// Enable group1 commands
keyboard.watch("group1");

function action0(isKeyDown) {
  if (isKeyDown) {
    // do something;
  }
}

function action1(isKeyDown) {
  if (isKeyDown) {
    // do something;
  }
}
```

## API Reference

```javascript
interface CtrlKeys {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
}

export interface Options {
  preventDefault?: boolean;
  scope?: this;
}

addCommand(
    name: string,
    ctrlKeys: CtrlKeys | null,
    keys: Array<string | number>,
    callback: Function,
    options: Options | null
  ): Command {}

setInputs(
    ctrlKeys: CtrlKeys,
    keys: Array<string | number>
  ): boolean {}

watch(groupName: string): boolean {} //start watching a group of commands

ignore(groupName: string): boolean {} //stop watching a group of commands

default(groupName: string, commandName: string): boolean {} //set command to default settings

getCommand(groupName: string, commandName: string): Command | null {}

```

## License

MIT License

Copyright (c) 2015 Ludovic CLUBER

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
