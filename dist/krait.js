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
    Down(a) {
        a.preventDefault();
        this.pressed = true;
    }
    Up() {
        this.pressed = false;
    }
}

class Command {
    constructor(name, ctrlKey, altkey, shiftKey, asciiCodes, callback, scope) {
        this.name = name;
        this.started = false;
        this.defaultCtrlKey = ctrlKey;
        this.defaultAltKey = altkey;
        this.defaultShiftKey = shiftKey;
        this.setInputs(ctrlKey, altkey, shiftKey, asciiCodes);
        this.callback = callback;
        if (scope) {
            this.callback = this.callback.bind(scope);
        }
        this.log = Logger.addGroup("Krait");
        this.log.info('Added new command ' + this.name);
    }
    start(a) {
        if (this.inputs.hasOwnProperty(a.which)) {
            this.inputs[a.which].Down(a);
        }
        for (let property in this.inputs) {
            if (this.inputs.hasOwnProperty(property)) {
                if (!this.inputs[property].pressed) {
                    return false;
                }
            }
        }
        if (this.ctrlKey == a.ctrlKey && this.altKey == a.altKey && this.shiftKey == a.shiftKey) {
            this.started = true;
            this.callback(this.started);
            return this.started;
        }
        return false;
    }
    stop(key) {
        if (this.inputs.hasOwnProperty(key)) {
            this.inputs[key].Up();
        }
        if (this.started) {
            this.started = false;
            this.callback(this.started);
            return true;
        }
        return false;
    }
    setInputs(ctrlKey, altkey, shiftKey, asciiCodes) {
        this.inputs = {};
        this.ctrlKey = ctrlKey;
        this.altKey = altkey;
        this.shiftKey = shiftKey;
        for (let asciiCode of asciiCodes) {
            if (!this.inputs.hasOwnProperty('asciiCode')) {
                this.inputs[asciiCode] = new Input(asciiCode);
            }
        }
        this.inputsLength = asciiCodes.length;
    }
    default() {
        for (let property in this.inputs) {
            if (this.inputs.hasOwnProperty(property)) {
                let oldInput = this.inputs[property];
                if (+property !== oldInput.defaultASCII) {
                    this.inputs[oldInput.defaultASCII] = new Input(oldInput.defaultASCII);
                    delete this.inputs[property];
                    this.ctrlKey = this.defaultCtrlKey;
                    this.altKey = this.defaultAltKey;
                    this.shiftKey = this.defaultShiftKey;
                }
            }
        }
        this.log.info(this.name + ' is now set to default');
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
        let isCommandStarted = false;
        for (let command of this.commands) {
            if (command.start(a) && !isCommandStarted) {
                isCommandStarted = true;
                this.log.info('Command ' + command.name + ' started');
            }
        }
    }
    up(a) {
        let isCommandStopped = false;
        for (let command of this.commands) {
            if (command.stop(a.which) && !isCommandStopped) {
                isCommandStopped = true;
                this.log.info('Command ' + command.name + ' stopped');
            }
        }
    }
    addCommand(name, ctrlKey, altkey, shiftKey, keys, callback, scope) {
        let asciiCodes = this.getAsciiCodes(keys);
        if (asciiCodes) {
            this.commands.push(new Command(name, ctrlKey, altkey, shiftKey, asciiCodes, callback, scope));
            this.commands = this.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    setInputs(name, ctrlKey, altkey, shiftKey, newKeys) {
        let asciiCodes = this.getAsciiCodes(newKeys);
        if (asciiCodes) {
            let command = this.getCommandByName(name);
            if (command) {
                command.setInputs(ctrlKey, altkey, shiftKey, asciiCodes);
                this.log.info(command.name + ' is now set to ' + JSON.stringify(newKeys));
                this.commands = this.sortCommands(this.commands);
                return true;
            }
        }
        return false;
    }
    default(name) {
        let command = this.getCommandByName(name);
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
    getCommandByName(name) {
        for (let command of this.commands) {
            if (command.name == name) {
                return command;
            }
        }
        return null;
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
        this.log.error(ascii + ' is not assignable to a valid ASCII code');
        return false;
    }
}

export { Keyboard };
