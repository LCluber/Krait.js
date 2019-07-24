var icon0 = Wee.Dom.findById("skill0");
var icon1 = Wee.Dom.findById("skill1");
var icon2 = Wee.Dom.findById("skill2");
var icon3 = Wee.Dom.findById("skill3");

var keyboard = new Krait.Keyboard();

keyboard.addCommand("action0", true, false, false, [65], action0, null);
keyboard.addCommand("action1", false, false, false, ["G"], action1, null);
keyboard.setInputs("action1", false, false, false, ["Z"]);
keyboard.addCommand("action2", false, false, false, ["E"], action2, null);
keyboard.addCommand("action3", false, false, false, ["R", "T"], action3, null);

function action0() {
  animate(icon0);
}

function action1() {
  animate(icon1);
}

function action2() {
  animate(icon2);
}

function action3() {
  animate(icon3);
}

function animate(icon) {
  icon.classList.remove("animation");
  void icon.offsetWidth;
  icon.classList.add("animation");
}
