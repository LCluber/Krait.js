import { Input } from "./input";
import { Logger, Group } from "@lcluber/mouettejs";
import { CtrlKeys } from "./interfaces";

export interface Inputs {
  [key: number]: Input;
}

export class Command {
  public name: string;
  private callback: Function;
  // scope : any;
  private inputs: Inputs;
  public inputsLength: number;
  private started: boolean;

  private ctrlKeys: CtrlKeys;
  private defaultControlKeys: CtrlKeys;

  private log: Group;

  constructor(
    name: string,
    ctrlKeys: CtrlKeys,
    asciiCodes: Array<number>,
    callback: Function,
    scope: any
  ) {
    this.name = name;
    this.started = false;
    this.defaultControlKeys = {
      ctrl: ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false,
      alt: ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false,
      shift: ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false
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

  public start(a: KeyboardEvent): boolean {
    if (this.inputs.hasOwnProperty(a.which)) {
      //pushed input is in the controls list
      this.inputs[a.which].Down(a);
    }
    for (let property in this.inputs) {
      if (this.inputs.hasOwnProperty(property)) {
        if (!this.inputs[property].pressed) {
          return false;
        }
      }
    }
    if (
      this.ctrlKeys.ctrl === a.ctrlKey &&
      this.ctrlKeys.alt === a.altKey &&
      this.ctrlKeys.shift === a.shiftKey
    ) {
      this.started = true;
      this.callback(this.started);
      return this.started;
    }
    return false;
  }

  public stop(key: number): boolean {
    if (this.inputs.hasOwnProperty(key)) {
      //pushed input is in the controls list
      this.inputs[key].Up();
    }
    if (this.started) {
      this.started = false;
      this.callback(this.started);
      return true;
    }
    return false;
  }

  public setInputs(ctrlKeys: CtrlKeys, asciiCodes: Array<number>): void {
    this.inputs = {};
    this.ctrlKeys.ctrl =
      ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl ? true : false;
    this.ctrlKeys.alt =
      ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false;
    this.ctrlKeys.shift =
      ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift ? true : false;
    for (let asciiCode of asciiCodes) {
      if (!this.inputs.hasOwnProperty("asciiCode")) {
        this.inputs[asciiCode] = new Input(asciiCode);
      }
    }
    this.inputsLength = asciiCodes.length;
  }

  public default(): void {
    for (let property in this.inputs) {
      if (this.inputs.hasOwnProperty(property)) {
        let oldInput = this.inputs[property];
        if (+property !== oldInput.defaultASCII) {
          this.inputs[oldInput.defaultASCII] = new Input(oldInput.defaultASCII);
          delete this.inputs[property];
          this.copyDefaultToCtrls();
        }
      }
    }
    this.log.info(this.name + " is now set to default");
  }

  private copyDefaultToCtrls(): void {
    this.ctrlKeys = JSON.parse(JSON.stringify(this.defaultControlKeys));
  }

  // private setName(asciiCodes: Array<number>): string {
  //   let name = '';
  //   for(let asciiCode of asciiCodes) {
  //     name += asciiCode + '+';
  //   }
  //   return name.slice(0, -1);
  // }
}
