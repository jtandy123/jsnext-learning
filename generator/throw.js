const g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

const i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}

function* gen() {
  yield console.log('hello');
  yield console.log('world');
}

const ge = gen();

try {
  // ge.next();
  ge.throw('e');
} catch (e) {
  console.log(e);
}
