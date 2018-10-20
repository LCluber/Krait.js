
export class Input {

  defaultASCII : number; //first ascii code assigned will be kept here
  pressed : boolean;

  constructor (ascii: number) {

    this.defaultASCII = ascii;
    this.pressed = false;

  }

  Down (a: KeyboardEvent): void {
    a.preventDefault();
    this.pressed = true;
  }

  Up (): void {
    // if(this.listenUp)
    this.pressed = false;
  }

}
