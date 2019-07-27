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
  public inputs: Inputs;
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
      ctrl:
        ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl
          ? true
          : false,
      alt:
        ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt
          ? true
          : false,
      shift:
        ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift
          ? true
          : false
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
      this.inputs[a.which].down(a);
      // check if every input is pressed
      if (this.inputsLength > 1) {
        for (let property in this.inputs) {
          if (this.inputs.hasOwnProperty(property)) {
            if (!this.inputs[property].pressed) {
              return false;
            }
          }
        }
      }
      // Check if controlkeys are pressed
      if (
        this.ctrlKeys.ctrl === a.ctrlKey &&
        this.ctrlKeys.alt === a.altKey &&
        this.ctrlKeys.shift === a.shiftKey
      ) {
        this.started = true;
        this.callback(this.started);
        return this.started;
      }
    }
    return false;
  }

  public stop(key: number): boolean {
    if (this.inputs.hasOwnProperty(key)) {
      this.inputs[key].up();
      if (this.started) {
        this.started = false;
        this.callback(this.started);
        return true;
      }
    }
    return false;
  }

  public setInputs(ctrlKeys: CtrlKeys, asciiCodes: number[]): void {
    this.inputs = {};
    this.ctrlKeys.ctrl =
      ctrlKeys && ctrlKeys.hasOwnProperty("ctrl") && ctrlKeys.ctrl
        ? true
        : false;
    this.ctrlKeys.alt =
      ctrlKeys && ctrlKeys.hasOwnProperty("alt") && ctrlKeys.alt ? true : false;
    this.ctrlKeys.shift =
      ctrlKeys && ctrlKeys.hasOwnProperty("shift") && ctrlKeys.shift
        ? true
        : false;
    for (let asciiCode of asciiCodes) {
      if (!this.inputs.hasOwnProperty("asciiCode")) {
        this.inputs[asciiCode] = new Input(asciiCode);
      }
    }
    this.inputsLength = asciiCodes.length;
  }

  public default(): void {
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
