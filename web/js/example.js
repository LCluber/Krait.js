
var icon0 = Wee.Dom.findById('skill0');
var icon1 = Wee.Dom.findById('skill1');
var icon2 = Wee.Dom.findById('skill2');
var icon3 = Wee.Dom.findById('skill3');

var keyboard = new Krait.Keyboard();

keyboard.addCommand( 'action0', 1,0,0, [65],  action0, null );
keyboard.addCommand( 'action1', 0,0,0, ['G'], action1, null );
keyboard.setInputs(  'action1', 0,0,0, ['Z'] );
keyboard.addCommand( 'action2', 0,0,0, ['E'], action2, null );
keyboard.addCommand( 'action3', 0,0,0, ['R','T'], action3, null );

function action0(){
  animate(icon0);
}

function action1(){
  animate(icon1);
}

function action2(){
  animate(icon2);
}

function action3(){
  animate(icon3);
}

function animate(icon){
  icon.classList.remove('animation');
  void icon.offsetWidth;
  icon.classList.add('animation');
}
