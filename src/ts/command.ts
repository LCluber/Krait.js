import { Input } from './input';
import { Logger } from '@lcluber/mouettejs';

export interface Inputs {
  [key: number]: Input;
}

export class Command {

  name : string;
  callback : Function;
  scope : any;
  inputs : Inputs;
  inputsLength : number;
  started : boolean;

  ctrlKey : boolean;
  altKey : boolean;
  shiftKey : boolean;

  defaultCtrlKey : boolean;
  defaultAltKey : boolean;
  defaultShiftKey : boolean;

  constructor (name: string, ctrlKey: boolean, altkey: boolean, shiftKey: boolean, asciiCodes: Array<number>, callback: Function, scope: any) {

    this.name = name;
    this.started = false;
    this.defaultCtrlKey = ctrlKey;
    this.defaultAltKey = altkey;
    this.defaultShiftKey = shiftKey;
    this.setInputs(ctrlKey, altkey, shiftKey, asciiCodes);
    this.callback = callback;
    if ( scope ) {
      this.callback = this.callback.bind( scope );
    }
    Logger.info('Added new command ' + this.name);
  }

  public start (a:  KeyboardEvent): boolean {
    if (this.inputs.hasOwnProperty(a.which)) {//pushed input is in the controls list
      this.inputs[a.which].Down(a);
    }
    for(let property in this.inputs) {
      if (this.inputs.hasOwnProperty(property)) {
        if(!this.inputs[property].pressed) {
          return false;
        }
      }
    }
    if (this.ctrlKey == a.ctrlKey && this.altKey == a.altKey && this.shiftKey == a.shiftKey) {
      this.callback(true);
      this.started = true;
      return true;
    }
    return false;
  }

  public stop (key: number): boolean {
    if (this.inputs.hasOwnProperty(key)) {//pushed input is in the controls list
      this.inputs[key].Up();
    }
    if (this.started) {
      // this.callback(false);
      this.started = false;
      return true;
    }
    return false;
  }

  public setInputs( ctrlKey: boolean, altkey: boolean, shiftKey: boolean, asciiCodes: Array<number>): void {
    this.inputs = {};
    this.ctrlKey = ctrlKey;
    this.altKey = altkey;
    this.shiftKey = shiftKey;
    for(let asciiCode of asciiCodes) {
      if(!this.inputs.hasOwnProperty('asciiCode')) {
        this.inputs[asciiCode] = new Input(asciiCode);
      }
    }
    this.inputsLength = asciiCodes.length;
  }

  public default(): void {
    for (let property in this.inputs) {
      if(this.inputs.hasOwnProperty(property)) {
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
    Logger.info(this.name + ' is now set to default');
  }

  // private setName(asciiCodes: Array<number>): string {
  //   let name = '';
  //   for(let asciiCode of asciiCodes) {
  //     name += asciiCode + '+';
  //   }
  //   return name.slice(0, -1);
  // }

}
