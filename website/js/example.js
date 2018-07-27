
var icon0 = Wee.Dom.findById('skill0');
var icon1 = Wee.Dom.findById('skill1');
var icon2 = Wee.Dom.findById('skill2');
var icon3 = Wee.Dom.findById('skill3');

var keyboard = new Krait.Keyboard();

keyboard.addInput( /*'action0', */ 65, action0, null );
keyboard.addInput( /*'action1', */'G', action1, null );
keyboard.setInput( 'G','Z' );
keyboard.addInput( /*'action2', */'E', action2, null );
keyboard.addInput( /*'action3', */'R', action3, null );

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
