let birth = '2016/03/22';

const person = {
    name: 'Karry',
    birth,
    hello() {
        console.log(`My name is ${this.name}`);
    }
};
person.hello();

let ms = {};

function getItem(key) {
    return key in ms ? ms[key] : null;
}

function setItem(key, value) {
    ms[key] = value;
}

function clear() {
    ms = {};
}

module.exports = { getItem, setItem, clear };

// setter and getter
const cart = {
    _wheels:4,

    get wheels() {
        return this._wheels;
    },

    set wheels(value) {
        if (value < this._wheels) {
            throw new Error('数值太小了！');
        }
        this._wheels = value;
    }
};

console.log(cart.wheels); // 4

const key = 'test';
let obj = {
    [key]: 'foo',
    [key + '1']() {
        console.log('ofo');
    }
};
console.log(obj); // { test: 'foo', test1: [Function: test1] }


const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
    [keyA]: 'valueA',
    [keyB]: 'valueB'
};

console.log(myObject); // { '[object Object]': 'valueB' }


const objj = {
    get foo() {},
    set foo(value) {}
};

// console.log(objj.foo.name); // TypeError

const descriptor = Object.getOwnPropertyDescriptor(objj, 'foo');
console.log(descriptor.get.name); // get foo
console.log(descriptor.set.name); // set foo

console.log((new Function).name); // anonymous
console.log((function foo() {}).bind(null).name); // bound foo

const key1 = Symbol('description');
const key2 = Symbol();
let objjj = {
    [key1]() {},
    [key2]() {},
};
console.log(objjj[key1].name); // [description]
console.log(objjj[key2].name); // ''

// Object.is() //
console.log(Object.is(NaN, NaN)); // true
console.log(Object.is(+0, - 0)); // false
console.log(Object.is(1, '1')); // false
console.log(NaN === NaN); // false
console.log(+0 === -0); // true
console.log('1' == 1); // true

Object.defineProperty(Object, 'is', {
    value: function(x, y) {
        if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
        }
        return x !== x && y !== y;
    },
    configurable: true,
    enumerable: false,
    writable: true
});

// Object.assign() //
// Object.assign(undefined); // 报错
// Object.assign(null); // 报错

let jbo = {a: 1};
console.log(Object.assign(jbo, undefined) === jbo); // true
console.log(Object.assign(jbo, null) === jbo); // true

const v1 = 'abc';
const v2 = true;
const v3 = 10;

const job = Object.assign({}, v1, v2, v3);
console.log(job); // { "0": "a", "1": "b", "2": "c" }

// Object.assign只拷贝自身可枚举属性，包括Symbol属性
console.log(Object.assign({ a: 'b' }, { [Symbol('c')]: 'd' })); // { a: 'b', [Symbol(c)]: 'd' }

/**
 * 浅拷贝
 * 同名属性替换 整体替换不合并
 * 数组的处理 Object(array)
 * 取值函数的处理 getter 取值复制
 */
function clone(origin) {
    return Object.assign({}, origin);
}

function clone(origin) {
    let originProto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(originProto), origin);
}

const merge = (...sources) => Object.assign({}, ...sources);

const DEFAULTS = {
    logLevel: 0,
    outputFormat: 'html'
};
function processContent(options) {
    options = Object.assign({}, DEFAULTS, options);
    console.log(options);
}

processContent({port: 8000}); // { logLevel: 0, outputFormat: 'html', port: 8000 }

// property descriptor object //
let ob = {foo:123};
console.log(Object.getOwnPropertyDescriptor(ob, 'foo')); // { value: 123, writable: true, enumerable: true, configurable: true }

/**
 * for...in 遍历所有可枚举属性，包括自身的和继承的，不含Symbol属性
 * Object.keys(obj)(不含Symbol属性), JSON.stringify(不含Symbol属性), Object.assign()(包含Symbol属性)只处理对象自身的可枚举属性
 */
// 所有Class的原型的方法都是不可枚举的
console.log(Object.getOwnPropertyDescriptor(class {foo() {}}.prototype, 'foo')); //{ value: [Function: foo], writable: true, enumerable: false, configurable: true }
console.log(typeof class {foo() {}}); // function

/**
 * Object.getOwnPropertyNames(obj) 包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性）的键名组成的数组
 * Object.getOwnPropertySymbols(obj) 包含对象自身的所有Symbol属性（包括不可枚举属性）的键名组成数组
 * Reflect.ownKeys(obj) 包含对象自身的所有键名，不管键名是Symbol或字符串，也不管是否可枚举
 *
 * 对象属性遍历次序规则：
 * - 首先遍历所有数值键，按照数值升序排列
 * - 其次遍历所有字符串键，按照加入时间升序排列
 * - 最后遍历所有Symbol键，按照加入时间升序排列
 */
console.log(Reflect.ownKeys({[Symbol()]: 0, [Symbol()]: 1, b: 0, 10: 0, 2: 0, a: 0})); // [ '2', '10', 'b', 'a', Symbol(), Symbol() ]

// Object.getOwnPropertyDescriptors() //
const objjjj = {
    foo: 123,
    get bar() {return 'abc';}
};
console.log(Object.getOwnPropertyDescriptors(objjjj));

function getOwnPropertyDescriptors(obj) {
    const result = {};
    for (let key of Reflect.ownKeys(obj)) {
        result[key] = Object.getOwnPropertyDescriptor(obj, key);
    }
    return result;
}

console.log(getOwnPropertyDescriptors(objjjj));

// Object.assign无法正确拷贝get属性和set属性，Object.assign方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法
const source = {
    set foo(value) {}
};
const target = {};
Object.assign(target, source);
console.log(Object.getOwnPropertyDescriptor(target, 'foo'));

const merge2 = (target, source) => Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
merge2(target, source);
console.log(Object.getOwnPropertyDescriptor(target, 'foo'));

const shallowClone = (obj) => Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));



















































