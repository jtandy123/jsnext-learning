/*
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

const obj = {};
const g = F.call(obj);

console.log(g.next());
console.log(g.next());
console.log(g.next());

console.log(obj);

console.log(obj instanceof F);
*/
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

const f = new F();

console.log(f.next()); // Object {value: 2, done: false}
console.log(f.next()); // Object {value: 3, done: false}
console.log(f.next()); // Object {value: undefined, done: true}

console.log(f.a); // 1
console.log(f.b); // 2
console.log(f.c); // 3

console.log(f instanceof gen); // true
console.log(f instanceof F); // false
