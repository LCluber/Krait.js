export class Input {
  // public defaultASCII: number; //first ascii code assigned will be kept here
  public pressed: boolean;

  constructor(/*ascii: number*/) {
    // this.defaultASCII = ascii;
    this.pressed = false;
  }

  down(a: KeyboardEvent): void {
    a.preventDefault();
    this.pressed = true;
  }

  up(): void {
    // if(this.listenUp)
    this.pressed = false;
  }
}
