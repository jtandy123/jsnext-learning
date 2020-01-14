// spread ... //
function push(array, ...items) {
    array.push(...items);
}

const arr = [];
push(arr, 1, 2, 3);
console.log(arr);

function add(x, y) {
    return x + y;
}

const numbers = [2, 28];
console.log(add(...numbers));

function f(v, w, x, y, z) {}
const args = [0, 1];
f(-1, ...args, 2, ...[3]);


// replace apply method //
function f(x, y, z) {}
const argss = [0, 1, 2];
f.apply(null, argss);
f(...argss);



// clone array //
const a1 = [1, 2];
const a2 = [...a1, 3];
const [...a22] = a1;

// merge array //
// [1, 2].concat(more);
// [1, 2, ...more];

// with deconstruct //
// a = list[0], rest = list.slice(1)
// [a, ...rest] = list

const [first, ...rest] = [];
console.log(first);
console.log(rest);
const [firstt, ...restt] = ["foo"];
console.log(firstt);
console.log(restt);

// with string //
console.log([...'hello']);

console.log('x\uD83D\uDE80y'.length); // 4
console.log([...'x\uD83D\uDE80y']); // 3

// return correct string length
function length(str) {
    return [...str].length;
}

function countSymbols(string) {
    return Array.from(string).length;
}

// with Map, Set //
let map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
]);
console.log(map.keys()); // MapIterator { 1, 2, 3 }
let arrr = [...map.keys()]; // [1, 2, 3]

// Array.from() //
// transform array-like object and iterable object to array
let arraylike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    'length': 3
};

var arr1 = [].slice.call(arraylike);
console.log(arr1);

let arr2 = Array.from(arraylike);
console.log(arr2);

console.log(Array.from('hello'));
console.log([...'hello']);
// 部署了Iterator接口的数据结构, Array.from都能将其转为数组
let namesSet = new Set(['a', 'b']);
console.log(Array.from(namesSet));

console.log(Array.from({'length': 3}));
console.log(Array.from({ length: 2 }, () => 'jack'));

const toArray = (() => Array.from ? Array.from : obj => [].slice.call(obj))();
console.log(toArray(arraylike));


// Array.of //
// Array.of基本上可以用来代替Array()或new Array()
console.log(Array()); // []
console.log(Array(3)); // [,,]
console.log(Array(1, 2, 3)); // [1, 2, 3]

function ArrayOf() {
    return [].slice.call(arguments);
}

function ArrayOf2() {
    return [...arguments];
}

console.log(ArrayOf2(undefined)); // [ undefined ]

// Array.prototype.copyWithin //
console.log([1, 2, 3, 4, 5].copyWithin(0, -2, -1)); // [ 4, 2, 3, 4, 5 ]
console.log([1, 2, 3, 4, 5].copyWithin(-2, -2, -1)); // [ 1, 2, 3, 4, 5 ]

// Array.prototype.find //
console.log([1, 2, 3, -5, 6].find(n => n < 0)); // -5
console.log([NaN].indexOf(NaN)); // -1
console.log([null, undefined, NaN].find(y => Object.is(undefined, y))); // undefined
console.log([null, undefined, NaN].findIndex(y => Object.is(undefined, y))); // 1

// Array.prototype.fill //

// Array.prototype.entries, Array.prototype.keys, Array.prototype.values //
for (let [index, item] of [1, 2, 3].entries()) {
    console.log(`${index}: ${item}`);
}

/*
 * es5对空位的处理，大多数情况下会忽略空位：
 * - forEach, filter, reduce, every, some都会跳过空位
 * - map会跳过空位，但会保留这个值
 * - join和toString会将空位视为undefined, 而undefined和null会被处理成空字符串
 *
 * es6将空位转为undefined
 *
 * */
console.log(0 in []);
console.log(0 in [undefined, undefined]);
console.log(0 in [,]);

[,'a'].forEach((x,i) => console.log(i));















