
var icon0 = findById('skill0');
var icon1 = findById('skill1');
var icon2 = findById('skill2');
var icon3 = findById('skill3');

var keyboard = new KRAIT.Keyboard();

keyboard.addInput( 'action0', 65, action0, null );
keyboard.addInput( 'action1', 90, action1, null );
keyboard.addInput( 'action2', 69, action2, null );
keyboard.addInput( 'action3', 82, action3, null );

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


function findById( id ) {
  return document.getElementById(id);
}
