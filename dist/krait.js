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

import { String } from '@lcluber/weejs';
import { isAscii, isInteger } from '@lcluber/chjs';
import { Logger } from '@lcluber/mouettejs';

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
        this.ctrlKeys = {
            ctrl: false,
            alt: false,
            shift: false
        };
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
        for (let property in this.ctrlKeys) {
            if (this.ctrlKeys.hasOwnProperty(property)) {
                this.ctrlKeys[property] =
                    ctrlKeys && ctrlKeys.hasOwnProperty(property) && ctrlKeys[property]
                        ? true
                        : false;
            }
        }
        for (let asciiCode of asciiCodes) {
            this.keys[asciiCode] = new Input();
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
            this.defaultInputs = {
                ctrlKeys: ctrlKeys,
                asciiCodes: asciiCodes
            };
            this.callback = callback;
            if (scope) {
                this.callback = this.callback.bind(scope);
            }
            this.log = Logger.addGroup("Krait");
            this.log.info("Added new command " + this.name);
        }
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
        this.inputs.set(this.defaultInputs.ctrlKeys, this.defaultInputs.asciiCodes);
        this.log.info(this.name + " is now set to default" + JSON.stringify(this.defaultInputs.asciiCodes));
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
