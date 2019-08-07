/** MIT License
* 
* Copyright (c) 2015 Ludovic CLUBER 
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* http://kraitjs.lcluber.com
*/

import { Logger } from '@lcluber/mouettejs';
import { String } from '@lcluber/weejs';
import { cloneDeep } from 'lodash-es';

/* MIT License

Copyright (c) 2009 Ludovic CLUBER

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

https://github.com/LCluber/Ch.js
*/
function isAscii(code, extended) {
    if (isInteger(code)) {
        return (extended && code >= 0 && code <= 255) || (code >= 0 && code <= 127);
    }
    return false;
}
function isInteger(number) {
    return number === parseInt(number, 10);
}

class Input {
    constructor() {
        this.pressed = false;
    }
    down(a) {
        a.preventDefault();
        this.pressed = true;
    }
    up() {
        this.pressed = false;
    }
}

class Inputs {
    constructor(ctrlKeys, asciiCodes) {
        this.length = 0;
        this.keys = {};
        this.ctrlKeys = {};
        this.set(ctrlKeys, asciiCodes);
    }
    start(a) {
        if (this.keys.hasOwnProperty(a.which)) {
            this.keys[a.which].down(a);
            if (this.length > 1) {
                for (let property in this.keys) {
                    if (this.keys.hasOwnProperty(property)) {
                        if (!this.keys[property].pressed) {
                            return false;
                        }
                    }
                }
            }
            if (this.ctrlKeys.ctrl === a.ctrlKey &&
                this.ctrlKeys.alt === a.altKey &&
                this.ctrlKeys.shift === a.shiftKey) {
                return true;
            }
        }
        return false;
    }
    stop(key) {
        if (this.keys.hasOwnProperty(key)) {
            this.keys[key].up();
            return true;
        }
        return false;
    }
    set(ctrlKeys, asciiCodes) {
        this.keys = {};
        this.ctrlKeys.ctrl =
            ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl
                ? true
                : false;
        this.ctrlKeys.alt =
            ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt
                ? true
                : false;
        this.ctrlKeys.shift =
            ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift
                ? true
                : false;
        for (let asciiCode of asciiCodes) {
            if (!this.keys.hasOwnProperty(asciiCode)) {
                this.keys[asciiCode] = new Input();
            }
        }
        this.length = asciiCodes.length;
    }
    getKeysAscii() {
        return Object.keys(this.keys);
    }
}

class Command {
    constructor(name, ctrlKeys, keys, callback, scope) {
        this.name = name;
        this.started = false;
        let asciiCodes = this.getAsciiCodes(keys);
        if (asciiCodes) {
            this.inputs = new Inputs(ctrlKeys, asciiCodes);
            this.defaultInputs = new Inputs(ctrlKeys, asciiCodes);
        }
        this.callback = callback;
        if (scope) {
            this.callback = this.callback.bind(scope);
        }
        this.log = Logger.addGroup("Krait");
        this.log.info("Added new command " + this.name);
        console.log(this.inputs);
    }
    start(a) {
        if (this.inputs.start(a)) {
            this.started = true;
            this.callback(this.started);
            return this.started;
        }
        return false;
    }
    stop(key) {
        if (this.inputs.stop(key) && this.started) {
            this.started = false;
            this.callback(this.started);
            return true;
        }
        return false;
    }
    setInputs(ctrlKeys, newKeys) {
        let asciiCodes = this.getAsciiCodes(newKeys);
        if (asciiCodes) {
            this.inputs.set(ctrlKeys, asciiCodes);
            this.log.info(this.name + " is now set to " + JSON.stringify(asciiCodes));
            return true;
        }
        return false;
    }
    getInputsAscii() {
        return this.inputs.getKeysAscii();
    }
    default() {
        this.inputs = cloneDeep(this.defaultInputs);
        this.log.info(this.name + " is now set to default");
    }
    getAsciiCodes(keys) {
        let asciiCodes = [];
        for (let key of keys) {
            let ascii = this.inputValidation(key);
            if (!ascii) {
                return false;
            }
            asciiCodes.push(ascii);
        }
        return asciiCodes;
    }
    inputValidation(ascii) {
        if (!isInteger(ascii)) {
            ascii = String.toASCII(ascii);
        }
        if (isAscii(ascii, true)) {
            return ascii;
        }
        this.log.error(ascii + " is not assignable to a valid ASCII code");
        return false;
    }
}

class Keyboard {
    constructor() {
        this.initListeners();
        this.commands = [];
        this.log = Logger.addGroup("Krait");
        this.listen = false;
    }
    initListeners() {
        document.onkeydown = (a) => {
            this.listen && this.down(a);
        };
        document.onkeyup = (a) => {
            this.listen && this.up(a);
        };
    }
    down(a) {
        for (let command of this.commands) {
            command.start(a);
        }
    }
    up(a) {
        for (let command of this.commands) {
            command.stop(a.which);
        }
    }
    start() {
        this.listen = true;
    }
    stop() {
        this.listen = false;
    }
    addCommand(name, controls, keys, callback, scope) {
        let command = new Command(name, controls, keys, callback, scope);
        this.commands.push(command);
        this.commands = this.sortCommands(this.commands);
        return command;
    }
    setInputs(name, ctrlKeys, newKeys) {
        let command = this.getCommand(name);
        if (command) {
            command.setInputs(ctrlKeys, newKeys);
            this.log.info(command.name + " is now set to " + JSON.stringify(newKeys));
            this.commands = this.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    default(name) {
        let command = this.getCommand(name);
        if (command) {
            command.default();
            this.commands = this.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    sortCommands(commands) {
        commands.sort(function (a, b) {
            return b.inputs.length - a.inputs.length;
        });
        return commands;
    }
    getCommand(name) {
        for (let command of this.commands) {
            if (command.name == name) {
                return command;
            }
        }
        return null;
    }
    getCommandInputsAscii(name) {
        let command = this.getCommand(name);
        return command ? command.getInputsAscii() : false;
    }
}

export { Keyboard };
