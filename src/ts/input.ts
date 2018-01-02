
export class Input {
  
  defaultASCII : number; //first ascii code assigned  will be kept here
  callback : Function;
  scope : any;
  
  constructor (ascii: number, callback: Function, scope: any) {
  
    this.defaultASCII = ascii;
    this.callback     = callback;
    if( scope ){
      this.callback   = this.callback.bind( scope );
    }
    
  }
  
  setDefaultASCII(ascii:number) {
    this.defaultASCII = ascii;
  }
  
  Down (a: KeyboardEvent) {
    //this.pushed=1;
    a.preventDefault();
    this.callback(true);
  }
  
  Up () {
    //this.pushed=0;
    //if(this.listenUp)
    this.callback(false);
  }
}
