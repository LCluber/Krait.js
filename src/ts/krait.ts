import { Check, String } from '@lcluber/weejs';
import { Logger } from '@lcluber/mouettejs';
import { Command } from './command';

export class Keyboard {

  map: Object;
  commands: Array<Command>;

  constructor() {
    this.initListeners();
    this.commands = [];
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

    let isCommandStarted = false;
    for (let command of this.commands) {
      if (command.start(a) && !isCommandStarted) {
        isCommandStarted = true;
        Logger.info('Command ' + command.name + ' started');
      }
    }
  }

  public up(a: KeyboardEvent): void {
    let isCommandStopped = false;
    for (let command of this.commands) {
      if (command.stop(a.which) && !isCommandStopped) {
        isCommandStopped = true;
        Logger.info('Command ' + command.name + ' stopped');
      }
    }
  }

  public addCommand(name: string, ctrlKey: boolean, altkey: boolean, shiftKey: boolean, keys: Array<string|number>, callback: Function, scope: any): boolean {
    let asciiCodes = this.getAsciiCodes(keys);
    if (asciiCodes) {
      this.commands.push(new Command(name, ctrlKey, altkey, shiftKey, asciiCodes, callback, scope));
      this.commands = this.sortCommands(this.commands);
      return true;
    }
    return false;
  }

  public setInputs(name: string,  ctrlKey: boolean, altkey: boolean, shiftKey: boolean, newKeys: Array<string|number>): boolean {
    let asciiCodes = this.getAsciiCodes(newKeys);
    if (asciiCodes) {
      let command = this.getCommandByName(name);
      if (command) {
        command.setInputs(ctrlKey, altkey, shiftKey, asciiCodes);
        Logger.info(command.name + ' is now set to ' + JSON.stringify(newKeys));
        this.commands = this.sortCommands(this.commands);
        return true;
      }
    }
    return false;
  }

  public default(name: string): boolean {
    let command = this.getCommandByName(name);
    if (command) {
      command.default();
      this.commands = this.sortCommands(this.commands);
      return true;
    }
  }

  private sortCommands(commands: Array<Command>): Array<Command> {
    commands.sort(function(a,b) {
      return b.inputsLength - a.inputsLength;
    });
    return commands;
  }

  private getCommandByName(name: string): Command|false {
    for (let command of this.commands) {
      if (command.name == name) {
        return command;
      }
    }
    return false;
  }

  private getAsciiCodes(keys: Array<string|number>): Array<number>|false {
    let asciiCodes = [];
    for(let key of keys) {
      let ascii: number|false = this.inputValidation(key);
      if (!ascii) {
        return false;
      }
       asciiCodes.push(ascii);
    }
    return asciiCodes;
  }

  private inputValidation(ascii: string|number): number|false {
    if (!Check.isInteger(ascii)) {
      ascii = String.toASCII(<string>ascii);
    }
    if (Check.isASCII(ascii, true)) {//valid ascii code
      return <number>ascii;
    }
    Logger.error(ascii + ' is not assignable to a valid ASCII code');
    return false;
  }

}
