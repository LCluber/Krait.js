import { String } from "@lcluber/weejs";
import { isInteger, isAscii } from "@lcluber/chjs";
import { cloneDeep } from "lodash-es";
import { Inputs } from "./inputs";
import { Logger, Group } from "@lcluber/mouettejs";
import { CtrlKeys } from "./interfaces";

export class Command {
  public name: string;
  private callback: Function;
  public inputs: Inputs;
  public defaultInputs: Inputs;
  private started: boolean;
  private log: Group;

  constructor(
    name: string,
    ctrlKeys: CtrlKeys,
    keys: Array<string | number>,
    callback: Function,
    scope: any
  ) {
    this.name = name;
    this.started = false;
    let asciiCodes = this.getAsciiCodes(keys);
    if (asciiCodes) {
      this.inputs = new Inputs(ctrlKeys, asciiCodes);
      this.defaultInputs = new Inputs(ctrlKeys, asciiCodes);
    }
    this.callback = callback;
    if (scope) {
      this.callback = this.callback.bind(scope);
    }
    this.log = Logger.addGroup("Krait");
    this.log.info("Added new command " + this.name);
    console.log(this.inputs);
  }

  public start(a: KeyboardEvent): boolean {
    if (this.inputs.start(a)) {
      this.started = true;
      this.callback(this.started);
      return this.started;
    }
    return false;
  }

  public stop(key: number): boolean {
    if (this.inputs.stop(key) && this.started) {
      this.started = false;
      this.callback(this.started);
      return true;
    }
    return false;
  }

  public setInputs(
    ctrlKeys: CtrlKeys,
    newKeys: Array<string | number>
  ): boolean {
    let asciiCodes = this.getAsciiCodes(newKeys);
    if (asciiCodes) {
      this.inputs.set(ctrlKeys, asciiCodes);
      this.log.info(this.name + " is now set to " + JSON.stringify(asciiCodes));
      return true;
    }
    return false;
  }

  public getInputsAscii() {
    return this.inputs.getKeysAscii();
  }

  public default(): void {
    // console.log(this.defaultInputs);
    this.inputs = cloneDeep(this.defaultInputs);
    //this.inputs = {...this.defaultInputs};
    // console.log(this.inputs);
    this.log.info(this.name + " is now set to default");
  }

  // private copyDefaultToCtrls(): void {
  //   this.ctrlKeys = JSON.parse(JSON.stringify(this.defaultControlKeys));
  // }

  private getAsciiCodes(keys: Array<string | number>): number[] | false {
    let asciiCodes = [];
    for (let key of keys) {
      let ascii: number | false = this.inputValidation(key);
      if (!ascii) {
        return false;
      }
      asciiCodes.push(ascii);
    }
    return asciiCodes;
  }

  private inputValidation(ascii: string | number): number | false {
    if (!isInteger(ascii)) {
      ascii = String.toASCII(<string>ascii);
    }
    if (isAscii(ascii, true)) {
      //valid ascii code
      return <number>ascii;
    }
    this.log.error(ascii + " is not assignable to a valid ASCII code");
    return false;
  }

  // private setName(asciiCodes: Array<number>): string {
  //   let name = '';
  //   for(let asciiCode of asciiCodes) {
  //     name += asciiCode + '+';
  //   }
  //   return name.slice(0, -1);
  // }
}
