import * as WEE from '../../bower_components/Weejs/dist/wee';
import * as MOUETTE from '../../bower_components/Mouettejs/dist/mouette';
import { Input } from './input';

export class Keyboard {

  constructor() {
    this.initListeners();
  }

  private initListeners() {
    //keyboard listeners
    //var _this = this;
    document.onkeydown = (a: KeyboardEvent) => {
      this.down(a);
    };
    document.onkeyup = (a: KeyboardEvent) => {
      this.up(a);
    };
  }

  public down(a: KeyboardEvent) {
    if (this[a.which] !== undefined) {//pushed input is in the controls list
      this[a.which].Down(a);
      MOUETTE.Logger.info('Key ' + a.which + ' pressed');
    }
    /*for(var i = 0 ; i < this.nb ; i++){
        var v = this.list[i];
    if(v.ascii == a.which){
        a.preventDefault();
        //if(!v.pushed)
            v.down();
        break;
    }
    }*/
  }

  public up(a: KeyboardEvent) {
    if (this[a.which] !== undefined) {//pushed input is in the controls list
      this[a.which].Up();
      MOUETTE.Logger.info('Key ' + a.which + ' released');
    }
    /*for(var i = 0 ; i < this.nb ; i++){
      var v = this.list[i];
      if(v.ascii == a.which){
        v.up();
        for(var j = 0 ; j < this.list.nb ; j++){
          if(j != i){
            v = this.list.list[j];
            if(v.pushed)
              v.down();
          }
        }
        break;
      }
    }*/
  }

  public addInput(character: string|number, callback: Function, scope: any): number|false {
    let ascii: number|false = this.inputValidation(character);
    if (ascii) {//valid ascii code
      this[ascii] = new Input(ascii, callback, scope);
      MOUETTE.Logger.info('Added new input with ASCII code ' + character);
      return ascii;
    }
    return false;
  }

  public setInput(oldCharacter: string|number, newCharacter: string|number): boolean {
    let oldASCII: number|false = this.inputValidation(oldCharacter);
    if (oldASCII) {//valid ascii code
      if (this.hasOwnProperty(oldASCII+'')) {//oldASCII found as parameter
        let newASCII = this.addInput(newCharacter, this[oldASCII].callback, this[oldASCII].scope);
        if (newASCII) {
          this[newASCII].setDefaultASCII(this[oldASCII].defaultASCII);
          delete this[oldASCII];
          MOUETTE.Logger.info(oldASCII + ' is now set to ' + newASCII);
          return true;
        }
        return false;
      }
      MOUETTE.Logger.error(oldASCII + ' input not found');
      return false;
    }
    return false;
  }

  // public getLastLog(): string{
  //   return this.log;
  // }

  private inputValidation(ascii: string|number): number|false {
    if (!WEE.Check.isInteger(ascii)) {
      ascii = WEE.String.toASCII(<string>ascii);
    }
    if (WEE.Check.isASCII(ascii, true)) {//valid ascii code
      return <number>ascii;
    }
    MOUETTE.Logger.error(ascii + ' is not assignable to a valid ASCII code');
    return false;
  }

}
