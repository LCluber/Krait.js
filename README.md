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
  ["Z"]
);

// Enable group1 commands
keyboard.startListening("group1");

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
  ["Z"]
);

// Enable group1 commands
keyboard.start("group1");

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

watch(groupName: string): boolean {}

ignore(groupName: string): boolean {}

default(groupName: string, commandName: string): boolean {}

getCommand(name: string): Command | null {}

getCommandInputs(name: string): string[] | false {}

```

## Tests

No tests to run yet

## Contributors

There is still a lot of work to do on this project and I would be glad to get all the help you can provide.
To contribute you can clone the project on **[GitHub](https://github.com/LCluber/Krait.js)** and see **NOTICE.md** for detailed installation walkthrough of the project.

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
