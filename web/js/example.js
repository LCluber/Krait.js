// Mouette.Logger.setLevel("info");

var icon0 = Wee.Dom.findById("skill0");
var icon1 = Wee.Dom.findById("skill1");
var icon2 = Wee.Dom.findById("skill2");
var icon3 = Wee.Dom.findById("skill3");

var keyboard = new Krait.Keyboard();

keyboard.addCommand(
  "group1",
  "action0",
  { ctrl: true, alt: false, shift: false },
  [65],
  action0,
  null
);
keyboard.addCommand(
  "group1",
  "action1",
  { ctrl: false, alt: false, shift: false },
  ["G"],
  action1,
  null
);
keyboard.setInputs(
  "group1",
  "action1",
  { ctrl: false, alt: false, shift: false },
  ["Z"]
);
keyboard.addCommand(
  "group2",
  "action2",
  { ctrl: false, alt: false, shift: false },
  ["E"],
  action2,
  null
);
keyboard.addCommand(
  "group1",
  "action3",
  { ctrl: false, alt: false, shift: false },
  ["R", "T"],
  action3,
  null
);
keyboard.start("group1");
keyboard.start("group2");
console.log(keyboard);
function action0(isKeyDown) {
  if (isKeyDown) {
    animate(icon0);
  }
}

function action1(isKeyDown) {
  if (isKeyDown) {
    animate(icon1);
  }
}

function action2(isKeyDown) {
  if (isKeyDown) {
    animate(icon2);
  }
}

function action3(isKeyDown) {
  if (isKeyDown) {
    animate(icon3);
  }
}

function animate(icon) {
  icon.classList.remove("animation");
  void icon.offsetWidth;
  icon.classList.add("animation");
}
