import { String } from "@lcluber/weejs";
import { isInteger, isAscii } from "@lcluber/chjs";
import { Logger, Group } from "@lcluber/mouettejs";
import { Command } from "./command";
import { CtrlKeys } from "./interfaces";

export class Keyboard {
  // map: Object;
  private commands: Command[];
  private log: Group;

  constructor() {
    this.initListeners();
    this.commands = [];
    this.log = Logger.addGroup("Krait");
  }

  private initListeners(): void {
    //keyboard listeners
    document.onkeydown = (a: KeyboardEvent) => {
      this.down(a);
    };
    document.onkeyup = (a: KeyboardEvent) => {
      this.up(a);
    };
  }

  public down(a: KeyboardEvent): void {
    for (let command of this.commands) {
      command.start(a);
    }
  }

  public up(a: KeyboardEvent): void {
    for (let command of this.commands) {
      command.stop(a.which);
    }
  }

  public start() {}

  public stop() {}

  public addCommand(
    name: string,
    controls: CtrlKeys,
    keys: Array<string | number>,
    callback: Function,
    scope: any
  ): boolean {
    let asciiCodes = this.getAsciiCodes(keys);
    if (asciiCodes) {
      this.commands.push(
        new Command(name, controls, asciiCodes, callback, scope)
      );
      this.commands = this.sortCommands(this.commands);
      return true;
    }
    return false;
  }

  public setInputs(
    name: string,
    ctrlKeys: CtrlKeys,
    newKeys: Array<string | number>
  ): boolean {
    let asciiCodes = this.getAsciiCodes(newKeys);
    if (asciiCodes) {
      let command = this.getCommand(name);
      if (command) {
        command.setInputs(ctrlKeys, asciiCodes);
        this.log.info(
          command.name + " is now set to " + JSON.stringify(newKeys)
        );
        this.commands = this.sortCommands(this.commands);
        return true;
      }
    }
    return false;
  }

  public default(name: string): boolean {
    let command = this.getCommand(name);
    if (command) {
      command.default();
      this.commands = this.sortCommands(this.commands);
      return true;
    }
    return false;
  }

  private sortCommands(commands: Command[]): Command[] {
    commands.sort(function(a, b) {
      return b.inputsLength - a.inputsLength;
    });
    return commands;
  }

  private getCommand(name: string): Command | null {
    for (let command of this.commands) {
      if (command.name == name) {
        return command;
      }
    }
    return null;
  }

  public getCommandInputsAscii(name: string): Array<string> | false {
    let command = this.getCommand(name);
    return command ? command.getInputsAscii() : false;
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
}
