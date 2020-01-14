// length property //
console.log((function(a, b , c){}).length); // 3
console.log((function(a = 5, b, c){}).length); // 0
console.log((function(a, b = 5, c){}).length); // 1
console.log((function(a, b, c = 5){}).length); // 2

// scope of default value of parameter //
var x = 1;
function fo(x, y = function() { console.log('y: ', x); x = 2; }) {
    console.log(x);
    var x = 3;
    y();
    console.log(x);
}

fo(); // 3
console.log(x); // 1

function ofo(x, y = function() { console.log('y: ', x);x = 2; }) {
    console.log(x);
    x = 3;
    y();
    console.log(x);
}

ofo(); // 2
console.log(x); // 1

// rest parameter //
function add(...values) {
    let sum = 0;

    for (var val of values) {
        sum += val;
    }

    return sum;
}

function add2(a, b, c) {
    return a + b + c;
}

console.log(add(2, 5, 3));

console.log(add.call(null, 2, 5, 3));

console.log(add.apply(null, [2, 5, 3]));

console.log(add2.call(null, 2, 5, 3));

console.log(add2.apply(null, [2, 5, 3]));

function sortNumbers() {
    return Array.prototype.slice.call(arguments).sort(); // 先将类似数组对象arguments转为数组
}

const sortNumbers2 = (...numbers) => numbers.sort();


function push(array, ...items) {
    items.forEach((item) => {
        array.push(item);
        console.log(item);
    });
    return array.length;
}

const a = [];
push(a, 1, 2, [3, 4], 5);
console.log(a); // [ 1, 2, [ 3, 4 ], 5 ]

function concat(array, ...items) {
    items.forEach((item) => {
        array = array.concat(item);
        console.log(array);
    });
    return array;
}

const b = [];
concat(b, 1, 2, [3, 4], 5);
console.log(b); // []

console.log((function(a, ...b){}).length); // 1

// strict mode //
/*
function foo(a, b = a) {
    'use strict';
    // ...
}
*/

const doSomething = (function() {
    'use strict';
    return function(value = 28) {
        return value;
    };
}());

console.log(doSomething()); // 28

// name property //
const f = function() {};
console.log(f.name); // f
console.log(f.bind({}).name); // bound f

const bar = function baz() {};
console.log(bar.name); // baz

console.log((new Function).name); // anonymous

// arrow function //
var of = v => v;

var of = function(v) {
    return v;
};

let getTempItem = id => ({'id': id, 'name': 'Temp'});

let oof = () => {a: console.log('test')};
oof();

let fn = () => void oof();

const full = ({first, last}) => `${first} ${last}`;

const isEven = n => n % 2 === 0;
const square = n => n ** 2;

const numbers = (...nums) => nums;
numbers(1, 2, 3, 4, 5);

const headAndTail = (head, ...tail) => [head, tail];
headAndTail(1, 2, 3, 4, 5);

// 箭头函数没有自己的this，内部的this就是外层代码块的this
/*
let s1Timer, s2Timer;
function Timer() {
    this.s1 = 0;
    this.s2 = 0;

    s1Timer = setInterval(() => {console.log('s1 this: ', this);this.s1++;}, 1000); // Timer instance

    s2Timer = setInterval(function() {
        console.log('s2 this: ', this);  // Timeout instance
        this.s2++;
    }, 1000);
}
const timer = new Timer();
setTimeout(() => {console.log('s1: ', timer.s1);clearInterval(s1Timer);}, 3100); // 3
setTimeout(() => {console.log('s2: ', timer.s2);clearInterval(s2Timer)}, 3100); // 0
*/

// 除了this, arguments、super、new.target这三个变量在箭头函数中也不存在，指向外层函数的对应变量
function f00() {
    setTimeout(() => {
        console.log('args:', arguments);
    }, 100);
}

f00(2, 4, 6, 8); // args: { '0': 2, '1': 4, '2': 6, '3': 8 }

// 箭头函数没有自己的this, 不能用call()、apply()、bind()这些方法改变this指向
(() => [(() => console.log('this.x: ', this.x)).bind({x: 'inner'})()]).call({x: 'outer'}); // undefined

(function() {
    return [
        (() => console.log('this.x: ', this.x)).bind({ x: 'inner' })()
    ];
}).call({ x: 'outer' }); // outer

(function() {
    return [
        (function() {console.log('this.x: ', this.x);}).bind({ x: 'inner' })()
    ];
}).call({ x: 'outer' }); // inner

// nested arrow function //
const pipeline = (...funcs) => val => funcs.reduce((a, b) => b(a), val);
const plus1 = a => a + 1;
const mult2 = a => a * 2;
const addThenMult = pipeline(plus1, mult2);
console.log(addThenMult(5)); // 12

// http://node.green
// :: function bind 用来取代call、apply、bind调用 //
// const hasOwnProperty = Object.prototype.hasOwnProperty;
// function hasOwn(obj, key) {
//     return obj::hasOwnProperty(key);
// }

// const objj = {'a': 1, 'b': 2};
// const addd = (a, b) => a + b;
// console.log(objj::addd(1, 2));

// Tail Call Optimization works in strict mode//
// Tail Recursion Call //
function tailFactorial(n, total) {
    if (n === 1) {
        return total;
    }
    return tailFactorial(n - 1, n * total);
}

function currying(fn, n) {
    return function(m) {
        console.log('curring: ', this); // global, 在浏览器中this指向window
        return fn.call(this, m, n);
    }
}
const factorial = currying(tailFactorial, 1);
console.log(factorial(5)); // 120

const curryingg = function(fn, n) {
    return m => {
        console.log('curryingg: ', this);  // global, 在浏览器中this指向window
        return fn.call(this, m, n);
    };
};
const factoriall = curryingg(tailFactorial, 1);
console.log(factoriall(5)); // 120

const curryinggg = (fn, n) => m => {
    console.log('curryinggg', this);  // {} ???, 在浏览器中this指向window
    return fn.call(this, m, n);
};
const factorialll = curryinggg(tailFactorial, 1);
console.log(factorialll(5)); // 120

const test = () => {
    console.log('test this: ', this); // {}
};
test();

// implement tail call optimization //
// trampoline function
function trampoline(f) {
    while(f && f instanceof Function) {
        f = f();
    }
    return f;
}

function sum(x, y) {
    if (y > 0) {
        return sum.bind(null, x + 1, y - 1);
    } else {
        return x;
    }
}

console.log(trampoline(sum(1, 100000)));


function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}

var summ = tco(function(x, y) {
    if (y > 0) {
        return summ(x + 1, y - 1)
    }
    else {
        return x
    }
});

console.log(summ(1, 100000));
