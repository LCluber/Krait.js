// import { Logger, Group } from "@lcluber/mouettejs";
import { CtrlKeys, Keys } from "./interfaces";
import { Input } from "./input";

export class Inputs {
  // public defaultASCII: number; //first ascii code assigned will be kept here
  public length: number;
  private keys: Keys;
  private ctrlKeys: CtrlKeys;
  // private log: Group;

  constructor(ctrlKeys: CtrlKeys, asciiCodes: number[]) {
    this.length = 0;
    this.keys = {};
    this.ctrlKeys = {
      ctrl: false,
      alt: false,
      shift: false
    };
    this.set(ctrlKeys, asciiCodes);
  }

  public start(a: KeyboardEvent): boolean {
    if (this.keys.hasOwnProperty(a.which)) {
      this.keys[a.which].down(a);
      // check if every input is pressed
      if (this.length > 1) {
        for (let property in this.keys) {
          if (this.keys.hasOwnProperty(property)) {
            if (!this.keys[property].pressed) {
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
        return true;
      }
    }
    return false;
  }

  public stop(key: number): boolean {
    if (this.keys.hasOwnProperty(key)) {
      this.keys[key].up();
      return true;
    }
    return false;
  }

  public set(ctrlKeys: CtrlKeys, asciiCodes: number[]): void {
    this.keys = {};
    for (let property in this.ctrlKeys) {
      if (this.ctrlKeys.hasOwnProperty(property)) {
        this.ctrlKeys[property] =
          ctrlKeys && ctrlKeys.hasOwnProperty(property) && ctrlKeys[property]
            ? true
            : false;
      }
    }
    for (let asciiCode of asciiCodes) {
      this.keys[asciiCode] = new Input();
    }
    this.length = asciiCodes.length;
  }

  public getKeysAscii() {
    return Object.keys(this.keys);
  }
}
