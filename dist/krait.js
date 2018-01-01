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

(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.KRAIT = {});
})(this, function(exports) {
    "use strict";
    var Input = function() {
        function Input(ascii, callback, scope) {
            this.defaultASCII = ascii;
            this.callback = callback;
            if (scope) {
                this.callback = this.callback.bind(scope);
            }
        }
        Input.prototype.setDefaultASCII = function(ascii) {
            this.defaultASCII = ascii;
        };
        Input.prototype.Down = function(a) {
            a.preventDefault();
            this.callback(true);
        };
        Input.prototype.Up = function() {
            this.callback(false);
        };
        return Input;
    }();
    var Keyboard = function() {
        function Keyboard() {
            this.initListeners();
        }
        Keyboard.prototype.initListeners = function() {
            var _this = this;
            document.onkeydown = function(a) {
                _this.down(a);
            };
            document.onkeyup = function(a) {
                _this.up(a);
            };
        };
        Keyboard.prototype.down = function(a) {
            if (this[a.which] !== undefined) {
                this[a.which].Down(a);
            }
        };
        Keyboard.prototype.up = function(a) {
            if (this[a.which] !== undefined) {
                this[a.which].Up();
            }
        };
        Keyboard.prototype.addInput = function(character, callback, scope) {
            var ascii = this.inputValidation(character);
            if (ascii) {
                this[ascii] = new Input(ascii, callback, scope);
                this.log = "Added new input with ASCII code " + character;
                return ascii;
            }
            return false;
        };
        Keyboard.prototype.setInput = function(oldCharacter, newCharacter) {
            var oldASCII = this.inputValidation(oldCharacter);
            if (oldASCII) {
                if (this.hasOwnProperty(oldASCII + "")) {
                    var newASCII = this.addInput(newCharacter, this[oldASCII].callback, this[oldASCII].scope);
                    if (newASCII) {
                        this[newASCII].setDefaultASCII(this[oldASCII].defaultASCII);
                        delete this[oldASCII];
                        this.log = oldASCII + " is now set to " + newASCII;
                        return true;
                    }
                    return false;
                }
                this.log = oldASCII + " input not found";
                return false;
            }
            return false;
        };
        Keyboard.prototype.getLastLog = function() {
            return this.log;
        };
        Keyboard.prototype.inputValidation = function(ascii) {
            if (!this.isInteger(ascii)) {
                ascii = this.stringToASCII(ascii);
            }
            if (this.isASCII(ascii, true)) {
                return ascii;
            }
            this.log = ascii + " is not assignable to a valid ASCII code";
            return false;
        };
        Keyboard.prototype.stringToASCII = function(code) {
            return code.charCodeAt(0);
        };
        Keyboard.prototype.isInteger = function(value) {
            return value === parseInt(value, 10);
        };
        Keyboard.prototype.isASCII = function(code, extended) {
            return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(code);
        };
        return Keyboard;
    }();
    exports.Keyboard = Keyboard;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});