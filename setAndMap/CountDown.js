let counter = 0;
let action = null;

console.log('in CountDown.js');

class CountDown {
  constructor(c, a) {
    counter = c;
    action = a;
  }

  dec() {
    if (counter < 1) return;
    counter--;
    if (counter === 0) {
      action();
    }
  }
}

module.exports = CountDown;