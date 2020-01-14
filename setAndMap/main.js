const s = new Set();
[2, 3, 4, 5, 5, 2, 2].forEach(x => s.add(x));
console.log([...s]); // [ 2, 3, 4, 5 ]

// Set可以接受具有iterable接口的其他数据结构作为参数，用来初始化
// const obj = {length: 3, 0: 1, 1: 2, 2: 3}; // array-like object is not iterable
// const ss = new Set([...obj]); // TypeError: obj is not iterable

const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
console.log(items.size); // 5

// 去除数组重复元素[...new Set(array)]
console.log([...new Set([1, 2, 3, 4, 5, 5, 5, 5])]); // [ 1, 2, 3, 4, 5 ]

// same-value-zero equality
let set = new Set();
let a = Number.NaN;
let b = Number.NaN;
set.add(a);
set.add(b);
console.log(set); // Set { NaN }

/*
add(value)
delete(value)
has(value)
clear()
 */
s.add(1).add(2).add(3);
console.log(s); // Set { 2, 3, 4, 5, 1 }

const array = Array.from(items);
console.log(items); // Set { 1, 2, 3, 4, 5 }
console.log(array); // [ 1, 2, 3, 4, 5 ]

function dedupe(array) {
    return Array.from(new Set(array));
}

/*
Set结构没有键名，只有键值，keys方法和values方法的行为完全一致
keys() 返回键名的遍历器
values() 返回键值得遍历器
entries() 返回键值对的遍历器
forEach() 使用回调函数遍历每个成员
 */
// Set的遍历顺序就是插入顺序
const se = new Set(['red', 'green', 'blue']);
for (let item of se.keys()) {
    console.log(item);
}
for (let item of se.values()) {
    console.log(item);
}
for (let item of se.entries()) {
    console.log(item);
}
// [ 'red', 'red' ]
// [ 'green', 'green' ]
// [ 'blue', 'blue' ]

console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true
for(let item of se) {
    console.log(item);
}

// Set.prototype.forEach()类似Array.prototype.forEach

// 扩展运算符（...）内部使用for...of循环，所以也可以用于 Set 结构
// 数组实例的方法可间接用于Set
let sett = new Set([1, 2, 3, 4, 5]);
sett = new Set([...sett].map(x => x**2));
console.log(sett);

// 并集
let union = new Set([...set, ...sett]);
console.log(union);
// 交集
let interset = new Set([...set].filter(x => sett.has(x)));
console.log(interset);
// 差集
let difference = new Set([...set].filter(x => !sett.has(x)));
console.log(difference);

// 在遍历中同步改变原来的Set结构，利用原Set结构映射出一个新的结构，然后赋值给原来的Set结构；另一种是利用Array.from方法
sett = new Set(Array.from(sett, val => val * 2));
console.log(sett); // Set { 2, 8, 18, 32, 50 }

// WeakSet //
// WeakSet的成员只能是对象，且对象都是弱引用(垃圾回收机制不考虑WeakSet对该对象的引用)，WeakSet不可遍历
// WeakSet适合临时存放一组对象，以及存放跟对象绑定的信息。WeakSet的成员不适合引用，它会随时消失
// WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏
const obj = {length: 3, 0: 1, 1: 2, 2: 3};
const xx = [[1, 2], [3, 4]];
const ws = new WeakSet(xx);
ws.add([1]);
console.log(ws);

/*
WeakSet.prototype.add(value)
WeakSet.prototype.delete(value)
WeakSet.prototype.has(value)
WeakSet没有size属性
 */
const foos = new WeakSet();
class Foo {
    constructor() {
        foos.add(this);
    }

    method() {
        if (!foos.has(this)) {
            throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
        }
    }
}

// Map //
// 解决js的对象只能用字符串当作键
// Map也是键值对的集合，各种类型的值(包括对象)都可以当作键
// Object结构提供了"字符串---值"的对应，Map结构提供了"值---值"的对应
const m = new Map();
const o = {p: 'hello world'};

m.set(o, 'content');
console.log(m.get(o)); // content
console.log(m.has(o)); // true
m.delete(o);
console.log(m.has(o)); // false

// 同名的key, 后面会覆盖前面
const map = new Map([
    ['name', 'jt'],
    ['name', 'Andy']
]);
console.log(map.size); // 2
console.log(map.get('name')); // jt

// 任何具有Iterator接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数
// Set和Map都可以用来生成新的Map
const s1 = new Set([['name', 'jt'], ['name', 'Andy']]);
const m1 = new Map(s1);
console.log(m1.get('name')); // Andy

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
console.log(m3.get('baz')); // 3

// 虽然NaN不严格相等于自身，但Map将其视为同一个键
m.set(NaN, 123);
console.log(m.get(NaN)); // 123

m.set(+0, 123);
console.log(m.get(-0)); // 123

/*
with (Map.prototype) {
    size
    set(key, value) 可链式
    get(key)
    has(key)
    delete(key)
    clear()

    keys()
    values()
    entries()
    forEach()
}
Map的遍历顺序就是插入顺序
 */

const mapp = new Map([['F', 'no'], ['T', 'yes']]);
for (let item of mapp.entries()) {
    console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of mapp.entries()) {
    console.log(key, value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of mapp) {
    console.log(key, value);
}
// "F" "no"
// "T" "yes"

console.log(Map.prototype[Symbol.iterator] === Map.prototype.entries); // true

// Map结构转为数组结构，使用扩展运算符(...)
// Map结构转为JSON: Map的键名都是字符串，可以转为对象JSON；键名有非字符串，可以转为数组JSON
let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
console.log(JSON.stringify([...myMap]));

// WeakMap //
// WeakMap只接受对象作为键名，不接受其他类型的值作为键名
// WeakMap的键名所指向的对象，不计入垃圾回收机制
// WeakMap的专用场合就是：它的键所对应的对象，可能会在将来消失。有助于防止内存泄露
// WeakMap弱引用的只是键名，键值依然是正常引用
// WeakMap应用的典型场合就是DOM节点作为键名
/*
let myElement = document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
 */
const wm = new WeakMap();
// wm.set(null, 123); // TypeError: Invalid value used as weak map key
// wm.set(undefined, 123); // TypeError: Invalid value used as weak map key
console.log(wm.get(null)); // undefined

/*
WeakMap只有四个方法可用：get(), set(), has(), delete()
 */
// WeakMap的另一个用处是部署私有属性
const _counter = new WeakMap();
const _action = new WeakMap();

class Countdown {
    constructor(counter, action) {
        _counter.set(this, counter);
        _action.set(this, action);
    }

    dec() {
        let counter = _counter.get(this);
        if (counter < 1) return;
        counter--;
        _counter.set(this, counter);
        if (counter === 0) {
            _action.get(this)();
        }
    }
}

const c = new Countdown(2, () => console.log('DONE'));
console.log(_counter.get(c)); // 2
c.dec();
console.log(_counter.get(c)); // 1
c.dec(); // DONE
console.log(_counter.get(c)); // 0
c.dec();
console.log(_counter.get(c)); // 0
// Countdown类的两个内部属性_counter和_action是实例的弱引用，如果删除实例，它们也随之消失，不会造成内存泄露














