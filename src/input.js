
function Input( name, ascii, callback, scope ) {
  this.name = name;
  this.ascii = ascii;
  this.defau = ascii;
  this.callback = callback;
  if( scope ){
    this.setScope( scope );
  }
}
  
Object.assign( Input.prototype, {    
  // create : function( name, ascii, callback, scope ){
  //   var _this = Object.create(this);
  //   _this.name = name;
  // 	_this.set(ascii);
  // 	_this.defau = _this.ascii;
  //   _this.callback = callback;
  //   if( scope )
  //     _this.setScope( scope );
  //   return _this;
  // },
  
  set : function(v){
    this.ascii = parseInt(v);
  },
  
  setScope : function( scope ){
    this.callback = this.callback.bind( scope );
  },
  
  Down : function(a){
    //this.pushed=1;
    a.preventDefault();
    this.callback(true);
  },
  
  Up : function(){
    //this.pushed=0;
    //if(this.listenUp)
    this.callback(false);
  }
});

export { Input };
