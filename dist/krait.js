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

import { Check, String } from 'weejs';
import { Logger } from 'mouettejs';

class Input {
    constructor(ascii, callback, scope) {
        this.defaultASCII = ascii;
        this.callback = callback;
        if (scope) {
            this.callback = this.callback.bind(scope);
        }
    }
    Down(a) {
        a.preventDefault();
        this.callback(true);
    }
    Up() {
        this.callback(false);
    }
}

class Keyboard {
    constructor() {
        this.initListeners();
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
        if (this[a.which] !== undefined) {
            this[a.which].Down(a);
            Logger.info('Key ' + a.which + ' pressed');
        }
    }
    up(a) {
        if (this[a.which] !== undefined) {
            this[a.which].Up();
            Logger.info('Key ' + a.which + ' released');
        }
    }
    addInput(character, callback, scope) {
        let ascii = this.inputValidation(character);
        if (ascii) {
            this[ascii] = new Input(ascii, callback, scope);
            Logger.info('Added new input with ASCII code ' + character);
            return ascii;
        }
        return false;
    }
    setInput(oldCharacter, newCharacter) {
        let oldASCII = this.inputValidation(oldCharacter);
        if (oldASCII) {
            if (this.hasOwnProperty(oldASCII + '')) {
                let newASCII = this.addInput(newCharacter, this[oldASCII].callback, this[oldASCII].scope);
                if (newASCII) {
                    this[newASCII].defaultASCII = this[oldASCII].defaultASCII;
                    delete this[oldASCII];
                    Logger.info(oldASCII + ' is now set to ' + newASCII);
                    return true;
                }
                return false;
            }
            Logger.error(oldASCII + ' input not found');
            return false;
        }
        return false;
    }
    inputValidation(ascii) {
        if (!Check.isInteger(ascii)) {
            ascii = String.toASCII(ascii);
        }
        if (Check.isASCII(ascii, true)) {
            return ascii;
        }
        Logger.error(ascii + ' is not assignable to a valid ASCII code');
        return false;
    }
}

export { Keyboard };
