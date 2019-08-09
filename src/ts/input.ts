export class Input {
  public pressed: boolean;

  constructor(/*ascii: number*/) {
    this.pressed = false;
  }

  down(a: KeyboardEvent): void {
    a.preventDefault();
    this.pressed = true;
  }

  up(): void {
    this.pressed = false;
  }
}
