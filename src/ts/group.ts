// import { Logger, Group } from "@lcluber/mouettejs";
import { Command } from "./command";
import { CtrlKeys } from "./interfaces";

export class Group {
  // map: Object;
  public name: string;
  private commands: Command[];
  // private log: Group;
  private listen: boolean;

  constructor(name: string) {
    this.name = name;
    this.commands = [];
    // this.log = Logger.addGroup("Krait");
    this.listen = false;
  }

  public down(a: KeyboardEvent): void {
    if (this.listen) {
      for (let command of this.commands) {
        command.start(a);
      }
    }
  }

  public up(key: number): void {
    if (this.listen) {
      for (let command of this.commands) {
        command.stop(key);
      }
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

  public getCommand(name: string): Command | null {
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
