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

import { isAscii, isInteger } from '@lcluber/chjs';

class Input {
    constructor() {
        this.pressed = false;
    }
    down(a, preventDefault) {
        if (preventDefault) {
            a.preventDefault();
        }
        this.pressed = true;
    }
    up() {
        this.pressed = false;
    }
}

class Inputs {
    constructor(ctrlKeys, asciiCodes, preventDefault) {
        this.length = 0;
        this.keys = {};
        this.setCtrlKeys(ctrlKeys);
        this.setKeys(asciiCodes);
        this.preventDefault = preventDefault;
    }
    start(a) {
        if (this.keys.hasOwnProperty(a.which)) {
            this.keys[a.which].down(a, this.preventDefault);
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
    setCtrlKeys(ctrlKeys) {
        this.ctrlKeys = {
            ctrl: ctrlKeys.ctrl,
            alt: ctrlKeys.alt,
            shift: ctrlKeys.shift
        };
    }
    setKeys(asciiCodes) {
        for (let asciiCode of asciiCodes) {
            this.keys[asciiCode] = new Input();
        }
        this.length = asciiCodes.length;
    }
}

class DefaultInputs {
    constructor(ctrlKeys, asciiCodes) {
        this.ctrlKeys = {
            ctrl: false,
            alt: false,
            shift: false
        };
        this.setCtrlKeys(ctrlKeys);
        this.asciiCodes = asciiCodes;
    }
    setCtrlKeys(ctrlKeys) {
        for (let property in this.ctrlKeys) {
            if (this.ctrlKeys.hasOwnProperty(property)) {
                this.ctrlKeys[property] =
                    ctrlKeys && ctrlKeys.hasOwnProperty(property) && ctrlKeys[property]
                        ? true
                        : false;
            }
        }
    }
}

class Command {
    constructor(name, ctrlKeys, keys, callback, options) {
        this.name = name;
        this.pressed = false;
        let asciiCodes = Command.getAsciiCodes(keys);
        if (asciiCodes) {
            this.defaultInputs = new DefaultInputs(ctrlKeys, asciiCodes);
            let preventDefault = options &&
                options.hasOwnProperty("preventDefault") &&
                options.preventDefault
                ? true
                : false;
            this.inputs = new Inputs(this.defaultInputs.ctrlKeys, asciiCodes, preventDefault);
            this.callback = callback;
            if (options && options.hasOwnProperty("scope")) {
                this.callback = this.callback.bind(options.scope);
            }
        }
    }
    start(a) {
        if (this.inputs.start(a)) {
            this.pressed = true;
            this.callback(this.pressed);
            return this.pressed;
        }
        return false;
    }
    stop(key) {
        if (this.inputs.stop(key) && this.pressed) {
            this.pressed = false;
            this.callback(this.pressed);
            return true;
        }
        return false;
    }
    setInputs(ctrlKeys, keys) {
        let asciiCodes = Command.getAsciiCodes(keys);
        if (asciiCodes) {
            this.inputs.setCtrlKeys(ctrlKeys);
            this.inputs.setKeys(asciiCodes);
            return true;
        }
        return false;
    }
    default() {
        this.inputs.setCtrlKeys(this.defaultInputs.ctrlKeys);
        this.inputs.setKeys(this.defaultInputs.asciiCodes);
    }
    static getAsciiCodes(keys) {
        let asciiCodes = [];
        for (let key of keys) {
            let ascii = Command.inputValidation(key);
            if (!ascii) {
                return false;
            }
            asciiCodes.push(ascii);
        }
        return asciiCodes;
    }
    static inputValidation(ascii) {
        if (!isInteger(ascii, false)) {
            ascii = Command.toASCII(ascii);
        }
        if (isAscii(ascii)) {
            return ascii;
        }
        return false;
    }
    static toASCII(code) {
        return code.charCodeAt(0);
    }
}

class Group {
    constructor(name) {
        this.name = name;
        this.commands = [];
        this.watch = false;
    }
    down(a) {
        if (this.watch) {
            for (let command of this.commands) {
                command.start(a);
            }
        }
    }
    up(key) {
        if (this.watch) {
            for (let command of this.commands) {
                command.stop(key);
            }
        }
    }
    addCommand(name, ctrlKeys, keys, callback, options) {
        let command = new Command(name, ctrlKeys, keys, callback, options);
        this.commands.push(command);
        this.commands = Group.sortCommands(this.commands);
        return command;
    }
    setInputs(name, ctrlKeys, keys) {
        let command = this.getCommand(name);
        if (command) {
            command.setInputs(ctrlKeys, keys);
            this.commands = Group.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    default(name) {
        let command = this.getCommand(name);
        if (command) {
            command.default();
            this.commands = Group.sortCommands(this.commands);
            return true;
        }
        return false;
    }
    getCommand(name) {
        for (let command of this.commands) {
            if (command.name == name) {
                return command;
            }
        }
        return null;
    }
    static sortCommands(commands) {
        commands.sort(function (a, b) {
            return b.inputs.length - a.inputs.length;
        });
        return commands;
    }
}

class Keyboard {
    constructor() {
        this.initListeners();
        this.groups = [];
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
        for (let group of this.groups) {
            group.down(a);
        }
    }
    up(a) {
        for (let group of this.groups) {
            group.up(a.which);
        }
    }
    watch(groupName) {
        let group = this.getGroup(groupName);
        if (group) {
            return (group.watch = true);
        }
        return false;
    }
    ignore(groupName) {
        let group = this.getGroup(groupName);
        if (group) {
            return (group.watch = false);
        }
        return true;
    }
    addCommand(groupName, commandName, ctrlKeys, keys, callback, scope) {
        let group = this.getGroup(groupName);
        if (!group) {
            group = new Group(groupName);
            this.groups.push(group);
        }
        return group.addCommand(commandName, ctrlKeys, keys, callback, scope);
    }
    setInputs(groupName, commandName, ctrlKeys, keys) {
        let group = this.getGroup(groupName);
        return group ? group.setInputs(commandName, ctrlKeys, keys) : false;
    }
    default(groupName, commandName) {
        let group = this.getGroup(groupName);
        return group ? group.default(commandName) : false;
    }
    getGroup(name) {
        for (let group of this.groups) {
            if (group.name == name) {
                return group;
            }
        }
        return null;
    }
    getCommand(groupName, commandName) {
        let group = this.getGroup(groupName);
        return group ? group.getCommand(commandName) : null;
    }
}

export { Keyboard };
