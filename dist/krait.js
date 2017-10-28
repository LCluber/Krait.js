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
    typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define([ "exports" ], factory) : factory(global.KRAIT = global.KRAIT || {});
})(this, function(exports) {
    "use strict";
    function Input(name, ascii, callback, scope) {
        this.name = name;
        this.ascii = ascii;
        this.defau = ascii;
        this.callback = callback;
        if (scope) {
            this.setScope(scope);
        }
    }
    Object.assign(Input.prototype, {
        set: function(v) {
            this.ascii = parseInt(v);
        },
        setScope: function(scope) {
            this.callback = this.callback.bind(scope);
        },
        Down: function(a) {
            a.preventDefault();
            this.callback(true);
        },
        Up: function() {
            this.callback(false);
        }
    });
    function Keyboard() {
        this.initListeners();
    }
    Object.assign(Keyboard.prototype, {
        initListeners: function() {
            var _this = this;
            document.onkeydown = function(a) {
                _this.down(a);
            };
            document.onkeyup = function(a) {
                _this.up(a);
            };
        },
        down: function(a) {
            if (this[a.which] !== undefined) this[a.which].Down(a);
        },
        up: function(a) {
            if (this[a.which] !== undefined) this[a.which].Up();
        },
        addInput: function(name, character, callback, scope) {
            var ascii = character;
            if (character !== parseInt(character, 10)) {
                ascii = character.charCodeAt(0);
            }
            if (this.isASCII(ascii, true)) {
                this[ascii] = new Input(name, ascii, callback, scope);
                return ascii;
            }
            return null;
        },
        isASCII: function(str, extended) {
            return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(str);
        }
    });
    exports.Keyboard = Keyboard;
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
});