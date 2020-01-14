/**
 * WeakSet的成员只能是对象，而不能是其他类型的值
 * WeakSet 里面的引用，都不计入垃圾回收机制，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
 * WeakSet不可遍历
 */
;(function() {
  const ws = new WeakSet();
  // ws.add(1); // TypeError: Invalid value used in weak set
  // ws.add(Symbol()); // TypeError: Invalid value used in weak set
}())

/**
 * 作为构造函数，WeakSet 可以接受一个数组或类似数组的对象作为参数。（实际上，任何具有 Iterable 接口的对象，都可以作为 WeakSet 的参数。）
 * 该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。这意味着数组的成员只能是对象。
 */
;(function() {
  const a = [[1, 2], [3, 4]];
  const ws = new WeakSet(a);
  console.log(ws);
}())

;(function() {
  const b = [3, 4];
  // const ws = new WeakSet(b); // TypeError: Invalid value used in weak set
}())

/**
 * WeakSet.prototype.add(value)
 * WeakSet.prototype.delete(value)
 * WeakSet.prototype.has(value)
 */
;(function() {
  const ws = new WeakSet();
  const obj = {};
  const foo = {};

  ws.add(global);
  ws.add(obj);

  console.log(ws.has(global)); // true
  console.log(ws.has(foo)); // false

  ws.delete(global);
  console.log(ws.has(global)); // false
}())

const foos = new WeakSet();
class Foo {
  constructor() {
    console.log('parent');
    foos.add(this);
  }

  method() {
    if (!foos.has(this)) {
      throw new TypeError('Foo.prototype.method只能在Foo的实例上调用！')
    }
  }
}

class Child extends Foo {
  constructor() {
    super();
    console.log('child');
  }
}

let fooChild = new Child();
fooChild.method();
// Foo.prototype.method();

// TypeError: Class constructor Foo cannot be invoked without 'new'
// const foo = Foo();
// foo.method();

// debugger;