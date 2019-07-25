var icon0 = Wee.Dom.findById("skill0");
var icon1 = Wee.Dom.findById("skill1");
var icon2 = Wee.Dom.findById("skill2");
var icon3 = Wee.Dom.findById("skill3");

var keyboard = new Krait.Keyboard();

keyboard.addCommand(
  "action0",
  { ctrl: true, alt: false, shift: false },
  [65],
  action0,
  null
);
keyboard.addCommand(
  "action1",
  { ctrl: false, alt: false, shift: false },
  ["G"],
  action1,
  null
);
keyboard.setInputs("action1", { ctrl: false, alt: false, shift: false }, ["Z"]);
keyboard.addCommand(
  "action2",
  { ctrl: false, alt: false, shift: false },
  ["E"],
  action2,
  null
);
keyboard.addCommand(
  "action3",
  { ctrl: false, alt: false, shift: false },
  ["R", "T"],
  action3,
  null
);

function action0(down) {
  if (down) {
    animate(icon0);
  }
}

function action1(down) {
  if (down) {
    animate(icon1);
  }
}

function action2(down) {
  if (down) {
    animate(icon2);
  }
}

function action3(down) {
  if (down) {
    animate(icon3);
  }
}

function animate(icon) {
  icon.classList.remove("animation");
  void icon.offsetWidth;
  icon.classList.add("animation");
}
