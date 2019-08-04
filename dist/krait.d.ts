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


export interface Inputs {
    [key: number]: Input;
}
export declare class Command {
    name: string;
    private callback;
    inputs: Inputs;
    inputsLength: number;
    private started;
    private ctrlKeys;
    private defaultControlKeys;
    private log;
    constructor(name: string, ctrlKeys: CtrlKeys, asciiCodes: Array<number>, callback: Function, scope: any);
    start(a: KeyboardEvent): boolean;
    stop(key: number): boolean;
    setInputs(ctrlKeys: CtrlKeys, asciiCodes: number[]): void;
    getInputsAscii(): string[];
    default(): void;
    private copyDefaultToCtrls;
}
export declare class Input {
    defaultASCII: number;
    pressed: boolean;
    constructor(ascii: number);
    down(a: KeyboardEvent): void;
    up(): void;
}
export interface CtrlKeys {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
}

export declare class Keyboard {
    private commands;
    private log;
    private listen;
    constructor();
    private initListeners;
    down(a: KeyboardEvent): void;
    up(a: KeyboardEvent): void;
    start(): void;
    stop(): void;
    addCommand(name: string, controls: CtrlKeys, keys: Array<string | number>, callback: Function, scope: any): boolean;
    setInputs(name: string, ctrlKeys: CtrlKeys, newKeys: Array<string | number>): boolean;
    default(name: string): boolean;
    private sortCommands;
    private getCommand;
    getCommandInputsAscii(name: string): Array<string> | false;
    private getAsciiCodes;
    private inputValidation;
}
