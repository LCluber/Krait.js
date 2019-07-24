import { Input } from "./input";
import { Logger, Group } from "@lcluber/mouettejs";

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

  private ctrlKey: boolean;
  private altKey: boolean;
  private shiftKey: boolean;

  private defaultCtrlKey: boolean;
  private defaultAltKey: boolean;
  private defaultShiftKey: boolean;

  private log: Group;

  constructor(
    name: string,
    ctrlKey: boolean,
    altkey: boolean,
    shiftKey: boolean,
    asciiCodes: Array<number>,
    callback: Function,
    scope: any
  ) {
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
      this.ctrlKey == a.ctrlKey &&
      this.altKey == a.altKey &&
      this.shiftKey == a.shiftKey
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

  public setInputs(
    ctrlKey: boolean,
    altkey: boolean,
    shiftKey: boolean,
    asciiCodes: Array<number>
  ): void {
    this.inputs = {};
    this.ctrlKey = ctrlKey;
    this.altKey = altkey;
    this.shiftKey = shiftKey;
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
          this.ctrlKey = this.defaultCtrlKey;
          this.altKey = this.defaultAltKey;
          this.shiftKey = this.defaultShiftKey;
        }
      }
    }
    this.log.info(this.name + " is now set to default");
  }

  // private setName(asciiCodes: Array<number>): string {
  //   let name = '';
  //   for(let asciiCode of asciiCodes) {
  //     name += asciiCode + '+';
  //   }
  //   return name.slice(0, -1);
  // }
}
