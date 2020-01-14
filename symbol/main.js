/**
 * Symbol的使用场景：
 * 防止属性名冲突，可以生成唯一的key
 * 
 * Symbol值作为名称属性，只会被Object.getOwnPropertySymbols(obj)和Reflect.ownKeys(obj)这两个方法遍历到。
 * 可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法
 * 
 */

let s = Symbol();
console.log(typeof s);

const obj = {
    [Symbol()]: 'a',
    [Symbol()]: 'b',
    [Symbol('a')]: 'c',
    [s]: 'd'
};
console.log(obj); // { [Symbol()]: 'a', [Symbol()]: 'b', [Symbol(a)]: 'c', [Symbol()]: 'd' }
console.log(obj[Symbol('a')]); // undefined
console.log(obj[s]); // d
console.log(Symbol('a') === Symbol('a')); // false
console.log(obj.toString()); // [object Object]

let sym = Symbol('My Symbol');
// Symbol值不能与其他类型的值进行运算
// console.log("your symbol is " + sym); // TypeError: Cannot convert a Symbol value to a string
// console.log(`your symbol is ${sym}`); // TypeError: Cannot convert a Symbol value to a string
// Symbol值可以显式转为字符串
console.log(String(sym)); // Symbol(My Symbol)
console.log(sym.toString()); // Symbol(My Symbol)
// Symbol值可以转为布尔值，不能转为数值
console.log(Boolean(sym)); // true
console.log(!sym); // false
// console.log(Number(sym)); // TypeError: Cannot convert a Symbol value to a number

let mySymbol = Symbol();

let a = {};
a[mySymbol] = 'hello';

let b = {
    [mySymbol]: 'hello'
};

let c = {};
Object.defineProperty(a, mySymbol, {
    value: 'hello'
});
console.log(Object.getOwnPropertyDescriptor(a, mySymbol)); // { value: 'hello', writable: true, enumerable: true, configurable: true }

// Symbol值作为对象属性名时，不能用点运算符
a.mySymbol = 'Hello!';
console.log(a[mySymbol]); // hello
console.log(a['mySymbol']); // Hello!

let ojb = {
    [s](arg) {}
};
console.log(ojb); // { [Symbol()]: [Function] }

const log = (level, message) => {
    // console.log(`${level}: ${message}`); // TypeError: Cannot convert a Symbol value to a string
    // console.log(level, `: ${message}`); // Symbol(debug) ': debug message'
    console.log(`: ${message}`, level); // : debug message Symbol(debug)
    // console.log(`${level.toString()}: ${message}`); // Symbol(debug): debug message
};

log.levels = {
    DEBUG: Symbol('debug'),
    INFO: Symbol('info'),
    WARN: Symbol('warn')
};

log(log.levels.DEBUG, 'debug message'); // Symbol(debug) ': debug message'
log(log.levels.INFO, 'info message'); // Symbol(info) ': info message'

// 常量使用Symbol值最大的好处就是其他值都不可能有相同的值

// 消除魔法字符串，涉及到类型判断的逻辑时，类型具体的值可能并不重要，只要确保不会和其他类型的值冲突即可
const shapeType= {
    triangle: Symbol(),
    circle: Symbol(),
    rectangle: Symbol()
};

const getArea = (shape, options) => {
    let area = 0;
    switch(shape) {
        case shapeType.triangle:
            area = .5 * options.width * options.height;
            break;
        case shapeType.circle:
            area = Math.PI * (options.radius ** 2);
            break;
        case shapeType.rectangle:
            area = options.width * options.height;
            break;
        default: throw new Error('shape error');
    }
    return area;
};

console.log(getArea(shapeType.triangle, {width: 100, height: 100})); // 5000

const objj = {};
let aa = Symbol('aa');
let bb = Symbol('bb');

objj[aa] = 'Hello';
objj[bb] = 'World';
console.log(Object.getOwnPropertySymbols(objj)); // [ Symbol(aa), Symbol(bb) ]

// 为对象定义一些非私有的内部属性/方法
let size = Symbol('size');
class Collection {
    constructor() {
        this[size] = 0;
    }

    add(item) {
        this[this[size]] = item;
        this[size]++;
    }

    static sizeOf(instance) {
        return instance[size];
    }
}

let x = new Collection();
console.log(Collection.sizeOf(x)); // 0
x.add('foo');
console.log(Collection.sizeOf(x)); // 1
console.log(Object.keys(x)); // ['0']
console.log(Object.getOwnPropertyNames(x)); // ['0']
console.log(Object.getOwnPropertySymbols(x)); // [Symbol(size)]

// Symbol.for(), Symbol.keyFor() //
// Symbol.for()和Symbol()都会生产新的Symbol，区别：Symbol.for()产生的Symbol会被登记在全局环境中供搜索，后者不会。
// Symbol.keyFor()返回一个已登记的Symbol类型值得key
let ss1 = Symbol.for('foo');
let ss2 = Symbol.for('foo');
let ss3 = Symbol('foo');
console.log(`ss1 === ss2: ${ss1 === ss2}`); // true
console.log(`ss1 === ss3: ${ss1 === ss3}`); // false

console.log(Symbol.for({a:1}) === Symbol.for({b:2})) // true

console.log(Symbol.keyFor(ss1)); // foo
console.log(Symbol.keyFor(ss3)); // undefined
// Symbol.for为Symbol值登记的名字，是全局环境的，可以在不同的iframe或service worker中取到同一个值

// Singleton //
const mod = require('./mod.js');
console.log(mod.foo); // hello

// 11个内置的Symbol值, 指向语言内部使用的方法 //
// 对象的Symbol.hasInstance属性，指向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法
class MyClass {
    [Symbol.hasInstance](foo) {
        return foo instanceof Array;
    }
}

console.log([1, 2, 3] instanceof new MyClass()); // true
console.log([1, 2, 3] instanceof MyClass); // false

class Even {
    static [Symbol.hasInstance](obj) {
        return Number(obj) % 2 === 0;
    }
}
/*
const Even = {
    [Symbol.hasInstance](obj) {
        return Number(obj) % 2 === 0;
    }
};
*/
console.log(1 instanceof Even); // false
console.log(2 instanceof Even); // true

// Symbol.isConcatSpreadable //
// 对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
let arr1 = ['c', 'd'];
console.log(arr1[Symbol.isConcatSpreadable]); // undefined
// 数组的默认行为是可以展开，Symbol.isConcatSpreadable默认等于undefined。该属性等于true时，也有展开的效果。
let arr2 = ['c', 'd', ['e', 'f'], 'g'];
arr2[Symbol.isConcatSpreadable] = true;
console.log(['a', 'b'].concat(arr2, 'h')); // [ 'a', 'b', 'c', 'd', [ 'e', 'f' ], 'g', 'h' ]
arr2[Symbol.isConcatSpreadable] = false;
console.log(['a', 'b'].concat(arr2, 'h')); // [ 'a', 'b', [ 'c', 'd', [ 'e', 'f' ], 'g', [Symbol(Symbol.isConcatSpreadable)]: false ], 'h' ]
console.log(typeof arr2); // object
// 类似数组的对象正好相反，默认不展开。它的Symbol.isConcatSpreadable属性设为true，才可以展开
console.log(['a', 'b'].concat(arr2, 'i')); // [ 'a', 'b', [ 'c', 'd', [ 'e', 'f' ], 'g', [Symbol(Symbol.isConcatSpreadable)]: false ], 'i' ]

// Symbol.species //
// 对象的Symbol.species属性，指向一个构造函数。创建衍生对象时就会使用这个属性返回的函数，作为构造函数
class MyArray extends Array {
    static get [Symbol.species]() { return Array; } // 定义Symbol.species属性要采用get取值器
}
const aaa = new MyArray(1, 2, 3);
const bbb = aaa.map(x => x);
const ccc = aaa.filter(x => x > 1);

console.log('species: ', bbb instanceof MyArray); // false
console.log('species: ', ccc instanceof Array); // true

console.log('------------------------------------------------------');

class MyArray2 extends Array {
    get [Symbol.species]() { 
        console.log('MyArray2 Symbol.species');
        return Array; 
    } // 定义Symbol.species属性要采用get取值器
}

const aaa2 = new MyArray2(1, 2, 3);
const bbb2 = aaa2.map(x => x);
const ccc2 = aaa2.filter(x => x > 1);

console.log('species2: ', bbb2 instanceof MyArray2); // true
console.log('species2: ', ccc2 instanceof Array); // true

console.log('-------------------------------------------------')

/* Symbol.species的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数。
它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能希望返回基类的实例，而不是子类的实例 */

// Symbol.match 对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值
/*
String.prototype.match(regexp)
等同于
regexp[Symbol.match](this)
*/
class MyMatcher {
    [Symbol.match](string) {
        return 'hello world'.indexOf(string);
    }
}

console.log('e'.match(new MyMatcher())); // 1
console.log('e'.match(MyMatcher.prototype)); // 1

// Symbol.replace 对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值
/*
String.prototype.replace(searchValue, replaceValue)
等同于
searchValue[Symbol.replace](this, replaceValue)
 */
const xx = {};
xx[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(xx, 'world'); // [ 'Hello', 'world' ]

// Symbol.split
// Symbol.iterator
// Symbol.toPrimitive
// Symbol.toStringTag 对象的Symbol.toStringTag属性，指向一个方法。在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，
// 它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。

class Collectionn {
    constructor() {
        this[Symbol.toStringTag] = 'aaa';
    }

    [Symbol.toStringTag]() {
        return 'xxx';
    }
}

let xxx = new Collectionn();
console.log(Object.prototype.toString.call(xxx)); // [object aaa]

class Ccllection {
    get [Symbol.toStringTag]() {
        return 'xxx';
    }
}

let xxxx = new Ccllection();
console.log(Object.prototype.toString.call(xxxx)); // [object xxx]

const test = {
  [Symbol.toStringTag]: 'xxx'
};
console.log(test.toString()); // [object xxx]

// Symbol.unscopables 对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除
console.log(Array.prototype[Symbol.unscopables]);
const rra = [1, 2, 3, 4];
console.log(rra.keys()); // Array Iterator {}
console.log(rra.entries()); // Array Iterator {}

console.log('---------------------------------------------------')

class MyClass2 {
    constructor() {
        // this[Symbol.unscopables] = {
        //     foo: true
        // };
        this.foo = () => 4;
    }
    get [Symbol.unscopables]() {
        return { foo: true };
    }

    foo() {
        return 1;
    }
}

var foo = () => 2;

with(new MyClass2()) {
    console.log('MyClass2: ', foo());
}

console.log('-----------------------------------');

var item = {
    foo() {
        return 3;
    },
    [Symbol.unscopables]: {
        foo: true
    }
}

with(item) {
    console.log('item: ', foo());
}




