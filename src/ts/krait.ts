import { Logger, Group } from "@lcluber/mouettejs";
import { Command } from "./command";
import { CtrlKeys } from "./interfaces";

export class Keyboard {
  // map: Object;
  private commands: Command[];
  private log: Group;
  private listen: boolean;

  constructor() {
    this.initListeners();
    this.commands = [];
    this.log = Logger.addGroup("Krait");
    this.listen = false;
  }

  private initListeners(): void {
    //keyboard listeners
    document.onkeydown = (a: KeyboardEvent) => {
      this.listen && this.down(a);
    };
    document.onkeyup = (a: KeyboardEvent) => {
      this.listen && this.up(a);
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

  public start() {
    this.listen = true;
  }

  public stop() {
    this.listen = false;
  }

  public addCommand(
    name: string,
    controls: CtrlKeys,
    keys: Array<string | number>,
    callback: Function,
    scope: any
  ): Command {
    let command = new Command(name, controls, keys, callback, scope);
    this.commands.push(command);
    this.commands = this.sortCommands(this.commands);
    return command;
  }

  public setInputs(
    name: string,
    ctrlKeys: CtrlKeys,
    newKeys: Array<string | number>
  ): boolean {
    let command = this.getCommand(name);
    if (command) {
      command.setInputs(ctrlKeys, newKeys);
      this.log.info(command.name + " is now set to " + JSON.stringify(newKeys));
      this.commands = this.sortCommands(this.commands);
      return true;
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
      return b.inputs.length - a.inputs.length;
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
}
