import { Input } from './input';

function Keyboard() {
  this.initListeners();
}
  
Object.assign( Keyboard.prototype, {
  // create : function(){
  //   var _this = Object.create(this);
  //   _this.initListeners();
  //   return _this;
  // },
  
  initListeners : function(){
    //keyboard listeners
    var _this = this;
    document.onkeydown = function(a){
      _this.down(a);
    };
    document.onkeyup = function(a){
      _this.up(a);
    };
  },
  
  down : function(a){
    if(this[a.which] !== undefined)//pushed input is in the controls list
      this[a.which].Down(a);
    /*for(var i = 0 ; i < this.nb ; i++){
        var v = this.list[i];
    if(v.ascii == a.which){
    	a.preventDefault();
    	//if(!v.pushed)
    		v.down();
    	break;
    }
    }*/
  },
  
  up : function(a){
    if(this[a.which] !== undefined)//pushed input is in the controls list
      this[a.which].Up();
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
  },
  
  addInput : function( name, ascii, callback, scope ){
    this[ascii] = new Input(name, ascii, callback, scope );
  }
  
});

export { Keyboard };
