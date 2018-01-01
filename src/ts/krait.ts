import { Input } from './input';

export class Keyboard {

    log: string;

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
        this.log = 'Added new input with ASCII code ' + character;
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
            this.log = oldASCII + ' is now set to ' + newASCII;
            return true;
          }
          return false;
        }
        this.log = oldASCII + ' input not found';
        return false;
      }
      return false;
    }
    
    public getLastLog(): string{
      return this.log;
    }
    
    private inputValidation(ascii: string|number): number|false {
      if (!this.isInteger(ascii)) {
        ascii = this.stringToASCII(<string>ascii);
      }
      if (this.isASCII(ascii, true)) {//valid ascii code
        return <number>ascii;
      }
      this.log = ascii + ' is not assignable to a valid ASCII code';
      return false;
    }

    private stringToASCII(code: string): number {
      return code.charCodeAt(0);
    }

    private isInteger(value: string|number): boolean {
      return (value === parseInt(<string>value, 10));
    }

    private isASCII(code: string|number, extended: boolean): boolean {
      return (extended ? /^[\x00-\xFF]*$/ : /^[\x00-\x7F]*$/).test(<string>code);
    }


}
