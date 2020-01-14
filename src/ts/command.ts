import { isInteger, isAscii } from "@lcluber/chjs";
// import { Logger, Group } from "@lcluber/mouettejs";
import { Inputs } from "./inputs";
import { CtrlKeys, DefaultInputs } from "./interfaces";

export class Command {
  public name: string;
  private callback: Function;
  public inputs: Inputs;
  public defaultInputs: DefaultInputs;
  private started: boolean;
  // private static log: Group;

  constructor(
    name: string,
    ctrlKeys: CtrlKeys,
    keys: Array<string | number>,
    callback: Function,
    scope: any
  ) {
    this.name = name;
    this.started = false;
    let asciiCodes = Command.getAsciiCodes(keys);
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
      // Command.log = Logger.addGroup("Krait");
      // Command.log.info("Added new command " + this.name);
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
    let asciiCodes = Command.getAsciiCodes(newKeys);
    if (asciiCodes) {
      this.inputs.set(ctrlKeys, asciiCodes);
      // Command.log.info(this.name + " is now set to " + JSON.stringify(asciiCodes));
      return true;
    }
    return false;
  }

  public getInputsAscii() {
    return this.inputs.getKeysAscii();
  }

  public default(): void {
    this.inputs.set(this.defaultInputs.ctrlKeys, this.defaultInputs.asciiCodes);
    // Command.log.info(
    //   this.name +
    //     " is now set to default" +
    //     JSON.stringify(this.defaultInputs.asciiCodes)
    // );
  }

  private static getAsciiCodes(keys: Array<string | number>): number[] | false {
    let asciiCodes = [];
    for (let key of keys) {
      let ascii: number | false = Command.inputValidation(key);
      if (!ascii) {
        return false;
      }
      asciiCodes.push(ascii);
    }
    return asciiCodes;
  }

  private static inputValidation(ascii: string | number): number | false {
    if (!isInteger(ascii, false)) {
      ascii = Command.toASCII(<string>ascii);
    }
    if (isAscii(ascii)) {
      //valid ascii code
      return <number>ascii;
    }
    //this.log.error(ascii + " is not assignable to a valid ASCII code");
    return false;
  }

  private static toASCII(code: string): number {
    return code.charCodeAt(0);
  }

  // private setName(asciiCodes: Array<number>): string {
  //   let name = '';
  //   for(let asciiCode of asciiCodes) {
  //     name += asciiCode + '+';
  //   }
  //   return name.slice(0, -1);
  // }
}
