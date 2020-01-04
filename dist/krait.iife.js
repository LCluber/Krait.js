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

var Krait = (function (exports) {
    'use strict';

    function isAscii(code) {
        var extended = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        if (isInteger(code, false)) {
            return extended && code >= 0 && code <= 255 || code >= 0 && code <= 127;
        }
        return false;
    }
    function isInteger(number) {
        var typeCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var int = parseInt(number, 10);
        return typeCheck ? number === int : number == int;
    }

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    * http://mouettejs.lcluber.com
    */

    var LEVELS = {
        info: { id: 1, name: "info", color: "#28a745" },
        trace: { id: 2, name: "trace", color: "#17a2b8" },
        warn: { id: 3, name: "warn", color: "#ffc107" },
        error: { id: 4, name: "error", color: "#dc3545" },
        off: { id: 99, name: "off", color: null }
    };

    function addZero(value) {
        return value < 10 ? "0" + value : value;
    }
    function formatDate() {
        var now = new Date();
        var date = [addZero(now.getMonth() + 1), addZero(now.getDate()), now.getFullYear().toString().substr(-2)];
        var time = [addZero(now.getHours()), addZero(now.getMinutes()), addZero(now.getSeconds())];
        return date.join("/") + " " + time.join(":");
    }

    var Message = function () {
        function Message(level, content) {
            _classCallCheck(this, Message);

            this.id = level.id;
            this.name = level.name;
            this.color = level.color;
            this.content = content;
            this.date = formatDate();
        }

        _createClass(Message, [{
            key: "display",
            value: function display(groupName) {
                console[this.name]("%c[" + groupName + "] " + this.date + " : ", "color:" + this.color + ";", this.content);
            }
        }]);

        return Message;
    }();

    var Group = function () {
        function Group(name, level) {
            _classCallCheck(this, Group);

            this.messages = [];
            this.name = name;
            this.messages = [];
            this.level = level;
        }

        _createClass(Group, [{
            key: "setLevel",
            value: function setLevel(name) {
                this.level = LEVELS.hasOwnProperty(name) ? LEVELS[name] : this.level;
                return this.getLevel();
            }
        }, {
            key: "getLevel",
            value: function getLevel() {
                return this.level.name;
            }
        }, {
            key: "info",
            value: function info(message) {
                this.log(LEVELS.info, message);
            }
        }, {
            key: "trace",
            value: function trace(message) {
                this.log(LEVELS.trace, message);
            }
        }, {
            key: "warn",
            value: function warn(message) {
                this.log(LEVELS.warn, message);
            }
        }, {
            key: "error",
            value: function error(message) {
                this.log(LEVELS.error, message);
            }
        }, {
            key: "log",
            value: function log(level, messageContent) {
                var message = new Message(level, messageContent);
                this.messages.push(message);
                if (this.level.id <= message.id) {
                    message.display(this.name);
                }
            }
        }]);

        return Group;
    }();

    var Logger = function () {
        function Logger() {
            _classCallCheck(this, Logger);
        }

        _createClass(Logger, null, [{
            key: "setLevel",
            value: function setLevel(name) {
                Logger.level = LEVELS.hasOwnProperty(name) ? LEVELS[name] : Logger.level;
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = Logger.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var group = _step.value;

                        group.setLevel(Logger.level.name);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return Logger.getLevel();
            }
        }, {
            key: "getLevel",
            value: function getLevel() {
                return Logger.level.name;
            }
        }, {
            key: "getGroup",
            value: function getGroup(name) {
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = Logger.groups[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var group = _step2.value;

                        if (group.name === name) {
                            return group;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return null;
            }
        }, {
            key: "addGroup",
            value: function addGroup(name) {
                return this.getGroup(name) || this.pushGroup(name);
            }
        }, {
            key: "pushGroup",
            value: function pushGroup(name) {
                var group = new Group(name, Logger.level);
                Logger.groups.push(group);
                return group;
            }
        }]);

        return Logger;
    }();

    Logger.level = LEVELS.error;
    Logger.groups = [];

    var Input = function () {
        function Input() {
            this.pressed = false;
        }
        Input.prototype.down = function (a) {
            a.preventDefault();
            this.pressed = true;
        };
        Input.prototype.up = function () {
            this.pressed = false;
        };
        return Input;
    }();

    var Inputs = function () {
        function Inputs(ctrlKeys, asciiCodes) {
            this.length = 0;
            this.keys = {};
            this.ctrlKeys = {
                ctrl: false,
                alt: false,
                shift: false
            };
            this.set(ctrlKeys, asciiCodes);
        }
        Inputs.prototype.start = function (a) {
            if (this.keys.hasOwnProperty(a.which)) {
                this.keys[a.which].down(a);
                if (this.length > 1) {
                    for (var property in this.keys) {
                        if (this.keys.hasOwnProperty(property)) {
                            if (!this.keys[property].pressed) {
                                return false;
                            }
                        }
                    }
                }
                if (this.ctrlKeys.ctrl === a.ctrlKey && this.ctrlKeys.alt === a.altKey && this.ctrlKeys.shift === a.shiftKey) {
                    return true;
                }
            }
            return false;
        };
        Inputs.prototype.stop = function (key) {
            if (this.keys.hasOwnProperty(key)) {
                this.keys[key].up();
                return true;
            }
            return false;
        };
        Inputs.prototype.set = function (ctrlKeys, asciiCodes) {
            this.keys = {};
            for (var property in this.ctrlKeys) {
                if (this.ctrlKeys.hasOwnProperty(property)) {
                    this.ctrlKeys[property] = ctrlKeys && ctrlKeys.hasOwnProperty(property) && ctrlKeys[property] ? true : false;
                }
            }
            for (var _i = 0, asciiCodes_1 = asciiCodes; _i < asciiCodes_1.length; _i++) {
                var asciiCode = asciiCodes_1[_i];
                this.keys[asciiCode] = new Input();
            }
            this.length = asciiCodes.length;
        };
        Inputs.prototype.getKeysAscii = function () {
            return Object.keys(this.keys);
        };
        return Inputs;
    }();

    var Command = function () {
        function Command(name, ctrlKeys, keys, callback, scope) {
            this.name = name;
            this.started = false;
            var asciiCodes = this.getAsciiCodes(keys);
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
        Command.prototype.start = function (a) {
            if (this.inputs.start(a)) {
                this.started = true;
                this.callback(this.started);
                return this.started;
            }
            return false;
        };
        Command.prototype.stop = function (key) {
            if (this.inputs.stop(key) && this.started) {
                this.started = false;
                this.callback(this.started);
                return true;
            }
            return false;
        };
        Command.prototype.setInputs = function (ctrlKeys, newKeys) {
            var asciiCodes = this.getAsciiCodes(newKeys);
            if (asciiCodes) {
                this.inputs.set(ctrlKeys, asciiCodes);
                this.log.info(this.name + " is now set to " + JSON.stringify(asciiCodes));
                return true;
            }
            return false;
        };
        Command.prototype.getInputsAscii = function () {
            return this.inputs.getKeysAscii();
        };
        Command.prototype.default = function () {
            this.inputs.set(this.defaultInputs.ctrlKeys, this.defaultInputs.asciiCodes);
            this.log.info(this.name + " is now set to default" + JSON.stringify(this.defaultInputs.asciiCodes));
        };
        Command.prototype.getAsciiCodes = function (keys) {
            var asciiCodes = [];
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                var ascii = this.inputValidation(key);
                if (!ascii) {
                    return false;
                }
                asciiCodes.push(ascii);
            }
            return asciiCodes;
        };
        Command.prototype.inputValidation = function (ascii) {
            if (!isInteger(ascii, false)) {
                ascii = this.toASCII(ascii);
            }
            if (isAscii(ascii)) {
                return ascii;
            }
            this.log.error(ascii + " is not assignable to a valid ASCII code");
            return false;
        };
        Command.prototype.toASCII = function (code) {
            return code.charCodeAt(0);
        };
        return Command;
    }();

    var Group$1 = function () {
        function Group(name) {
            this.name = name;
            this.commands = [];
            this.listen = false;
        }
        Group.prototype.down = function (a) {
            if (this.listen) {
                for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
                    var command = _a[_i];
                    command.start(a);
                }
            }
        };
        Group.prototype.up = function (key) {
            if (this.listen) {
                for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
                    var command = _a[_i];
                    command.stop(key);
                }
            }
        };
        Group.prototype.start = function () {
            return this.listen = true;
        };
        Group.prototype.stop = function () {
            this.listen = false;
            return true;
        };
        Group.prototype.addCommand = function (name, controls, keys, callback, scope) {
            var command = new Command(name, controls, keys, callback, scope);
            this.commands.push(command);
            this.commands = this.sortCommands(this.commands);
            return command;
        };
        Group.prototype.setInputs = function (name, ctrlKeys, newKeys) {
            var command = this.getCommand(name);
            if (command) {
                command.setInputs(ctrlKeys, newKeys);
                this.commands = this.sortCommands(this.commands);
                return true;
            }
            return false;
        };
        Group.prototype.default = function (name) {
            var command = this.getCommand(name);
            if (command) {
                command.default();
                this.commands = this.sortCommands(this.commands);
                return true;
            }
            return false;
        };
        Group.prototype.sortCommands = function (commands) {
            commands.sort(function (a, b) {
                return b.inputs.length - a.inputs.length;
            });
            return commands;
        };
        Group.prototype.getCommand = function (name) {
            for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
                var command = _a[_i];
                if (command.name == name) {
                    return command;
                }
            }
            return null;
        };
        Group.prototype.getCommandInputsAscii = function (name) {
            var command = this.getCommand(name);
            return command ? command.getInputsAscii() : false;
        };
        return Group;
    }();

    var Keyboard = function () {
        function Keyboard() {
            this.initListeners();
            this.groups = [];
        }
        Keyboard.prototype.initListeners = function () {
            var _this = this;
            document.onkeydown = function (a) {
                _this.down(a);
            };
            document.onkeyup = function (a) {
                _this.up(a);
            };
        };
        Keyboard.prototype.down = function (a) {
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                group.down(a);
            }
        };
        Keyboard.prototype.up = function (a) {
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                group.up(a.which);
            }
        };
        Keyboard.prototype.start = function (groupName) {
            var group = this.getGroup(groupName);
            return group ? group.start() : false;
        };
        Keyboard.prototype.stop = function (groupName) {
            var group = this.getGroup(groupName);
            return group ? group.stop() : false;
        };
        Keyboard.prototype.addCommand = function (groupName, commandName, ctrlKeys, keys, callback, scope) {
            var group = this.getGroup(groupName);
            if (!group) {
                group = new Group$1(groupName);
                this.groups.push(group);
            }
            return group.addCommand(commandName, ctrlKeys, keys, callback, scope);
        };
        Keyboard.prototype.setInputs = function (groupName, commandName, ctrlKeys, newKeys) {
            var group = this.getGroup(groupName);
            return group ? group.setInputs(commandName, ctrlKeys, newKeys) : false;
        };
        Keyboard.prototype.default = function (groupName, commandName) {
            var group = this.getGroup(groupName);
            return group ? group.default(commandName) : false;
        };
        Keyboard.prototype.getGroup = function (name) {
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                if (group.name == name) {
                    return group;
                }
            }
            return null;
        };
        Keyboard.prototype.getCommand = function (groupName, commandName) {
            var group = this.getGroup(groupName);
            return group ? group.getCommand(commandName) : null;
        };
        Keyboard.prototype.getCommandInputsAscii = function (groupName, commandName) {
            var command = this.getCommand(groupName, commandName);
            return command ? command.getInputsAscii() : false;
        };
        return Keyboard;
    }();

    exports.Keyboard = Keyboard;

    return exports;

}({}));
