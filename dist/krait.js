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
import { Logger } from '@lcluber/mouettejs';

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
    constructor(ascii) {
        this.defaultASCII = ascii;
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

class Command {
    constructor(name, ctrlKeys, asciiCodes, callback, scope) {
        this.name = name;
        this.started = false;
        this.defaultControlKeys = {
            ctrl: ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false,
            alt: ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false,
            shift: ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false
        };
        this.ctrlKeys = {};
        this.setInputs(ctrlKeys, asciiCodes);
        this.callback = callback;
        if (scope) {
            this.callback = this.callback.bind(scope);
        }
        this.log = Logger.addGroup("Krait");
        this.log.info("Added new command " + this.name);
    }
    start(a) {
        if (this.inputs.hasOwnProperty(a.which)) {
            this.inputs[a.which].down(a);
            if (this.inputsLength > 1) {
                for (let property in this.inputs) {
                    if (this.inputs.hasOwnProperty(property)) {
                        if (!this.inputs[property].pressed) {
                            return false;
                        }
                    }
                }
            }
            if (this.ctrlKeys.ctrl === a.ctrlKey &&
                this.ctrlKeys.alt === a.altKey &&
                this.ctrlKeys.shift === a.shiftKey) {
                this.started = true;
                this.callback(this.started);
                return this.started;
            }
        }
        return false;
    }
    stop(key) {
        if (this.inputs.hasOwnProperty(key)) {
            this.inputs[key].up();
        }
        if (this.started) {
            this.started = false;
            this.callback(this.started);
            return true;
        }
        return false;
    }
    setInputs(ctrlKeys, asciiCodes) {
        this.inputs = {};
        this.ctrlKeys.ctrl =
            ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false;
        this.ctrlKeys.alt =
            ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false;
        this.ctrlKeys.shift =
            ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false;
        for (let asciiCode of asciiCodes) {
            if (!this.inputs.hasOwnProperty("asciiCode")) {
                this.inputs[asciiCode] = new Input(asciiCode);
            }
        }
        this.inputsLength = asciiCodes.length;
    }
    default() {
        this.inputsLength = 0;
        for (let property in this.inputs) {
            if (this.inputs.hasOwnProperty(property)) {
                let oldInput = this.inputs[property];
                if (+property !== oldInput.defaultASCII) {
                    this.inputs[oldInput.defaultASCII] = new Input(oldInput.defaultASCII);
                    delete this.inputs[property];
                    this.inputsLength++;
                    this.copyDefaultToCtrls();
                }
            }
        }
        this.log.info(this.name + " is now set to default");
    }
    copyDefaultToCtrls() {
        this.ctrlKeys = JSON.parse(JSON.stringify(this.defaultControlKeys));
    }
}

class Keyboard {
    constructor() {
        this.initListeners();
        this.commands = [];
        this.log = Logger.addGroup("Krait");
    }
    initListeners() {
        document.onkeydown = (a) => {
            this.down(a);
        };
        document.onkeyup = (a) => {
            this.up(a);
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
    addCommand(name, controls, keys, callback, scope) {
        let asciiCodes = this.getAsciiCodes(keys);
        if (asciiCodes) {
            this.commands.push(new Command(name, controls, asciiCodes, callback, scope));
            this.commands = this.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    setInputs(name, ctrlKeys, newKeys) {
        let asciiCodes = this.getAsciiCodes(newKeys);
        if (asciiCodes) {
            let command = this.getCommand(name);
            if (command) {
                command.setInputs(ctrlKeys, asciiCodes);
                this.log.info(command.name + " is now set to " + JSON.stringify(newKeys));
                this.commands = this.sortCommands(this.commands);
                return true;
            }
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
            return b.inputsLength - a.inputsLength;
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
        if (command) {
            return Object.keys(command.inputs);
        }
        return false;
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

export { Keyboard };
