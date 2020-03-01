function* inner() {
  yield 'hello';
  yield 'world';
}

function* outer1() {
  yield 'open';
  yield inner();
  yield 'close';
}

const gen = outer1();
gen.next().value; // "open"
gen.next().value; // 返回一个遍历器对象
gen.next().value; // "close"

function* outer2() {
  yield 'open';
  yield* inner();
  yield 'close';
}

const gen2 = outer2();
console.log(gen2.next().value); // "open"
console.log(gen2.next().value); // "hello"
console.log(gen2.next().value); // "world"
console.log(gen2.next().value); // "close"
