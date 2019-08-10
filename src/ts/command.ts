import { String } from "@lcluber/weejs";
import { isInteger, isAscii } from "@lcluber/chjs";
import { Logger, Group } from "@lcluber/mouettejs";
import { Inputs } from "./inputs";
import { CtrlKeys, DefaultInputs } from "./interfaces";

export class Command {
  public name: string;
  private callback: Function;
  public inputs: Inputs;
  public defaultInputs: DefaultInputs;
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
    this.inputs.set(this.defaultInputs.ctrlKeys, this.defaultInputs.asciiCodes);
    this.log.info(
      this.name +
        " is now set to default" +
        JSON.stringify(this.defaultInputs.asciiCodes)
    );
  }

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
    if (!isInteger(ascii, false)) {
      ascii = String.toASCII(<string>ascii);
    }
    if (isAscii(ascii)) {
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
