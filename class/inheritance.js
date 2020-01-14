/**
 * 子类必须在constructor方法中调用super方法，否则新建实例时会报错。
 * 如果不调用super方法，子类就得不到this对象。
 * 
 * ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。
 * ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
 * 
 * 在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。
 * 父类的静态方法，也会被子类继承。
 */

class A {
    x = 1

    constructor() {
        console.log(new.target.name)
    }

    static hello() {
        console.log('hello world')
    }

    print() {
        console.log(this.x)
    }
}
A.prototype.y = 3

class B extends A {
    constructor() {
        super()
        console.log(super.y)
        this.x = 2
        this.y = 4
        super.y = 5
        console.log('super.y: ', super.y)
        console.log('this.y: ', this.y)
    }

    m() {
        super.print() // super.print.call(this)
    }
}
B.hello()

// Object.getPrototypeOf方法可以用来从子类上获取父类。父类是子类的原型，父类的原型是子类的原型
console.log(Object.getPrototypeOf(B) === A) // true, 可以用这个方法判断一个类是否继承了另一个类
console.log(Object.getPrototypeOf(B.prototype) === A.prototype) // true

/**
 * super关键字，既可以当作函数使用，也可以当作对象使用。
 * 第一种情况，super作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次super函数。
 * 注意，super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B的实例，因此super()在这里相当于A.prototype.constructor.call(this)。
 * 作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错。
 */



// new A() // A
// new B() // B, 在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。

/**
 * 第二种情况，super作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
 * 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。如果属性定义在父类的原型对象上，super就可以取到。
 * 
 * ES6 规定，在子类普通方法中通过super调用父类的方法时，方法内部的this指向当前的子类实例。
 * 由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。
 */
let b = new B()
b.m() // 2

/**
 * 如果super作为对象，用在静态方法之中，这时super将指向父类，而不是父类的原型对象。
 * 在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。
 */

class CA {
    a = 1
    constructor() {
        console.log('CA constructor')
        this.b = 2
        if (new.target.name === 'CB') { // 在子类调用super()时，父类构造方法中的this指向的是子类的实例
            this.c = 3
        }
        console.log(this)
    }

    method() {
        console.log('CA method: ', this.a)
    }

    static method() {
        console.log('CA static method: ', this.b) // 此处的this指向的是类CA，子类中使用super调用此方法时，this指向子类
        console.log(this)
    }
}
CA.b = 'static b in CA'

CA.prototype.method() // CA method: undefined

const ca = new CA()
ca.method()

class CB extends CA {
    constructor() {
        super()
        super.d = 4 // 等同于this.d = 4
    }

    method() {
        console.log('CB method')
        super.method() // method中的this指向当前子类的实例, super指向父类CA的原型
    }

    static method() {
        console.log('CB static method')
        super.method() // method中的this指向子类CB, super指向父类CA
    }
}
CB.b = 'static b in CB'

const cb = new CB()
console.log('cb.c: ', cb.c) // 3
cb.method()
CB.method() // 若CB中没有method静态方法，调用的是父类CA中的method方法，方法中的this指向父类CB

console.log('cb.d: ', cb.d)

// 注：使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错

// 由于对象总是继承其他对象的，所以可以在任意一个对象中，使用super关键字。
var obj = {
    toString() {
        return 'MyObject: ' + super.toString()
    }
}
console.log(obj.toString())

/**
 * Class 作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
 *（1）子类的__proto__属性，表示构造函数的继承，总是指向父类。
 *（2）子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。
 * 
 * 类的继承是按照下面的模式实现的：
 * class A {}
 * class B {}
 * Object.setPrototypeOf(B.prototype, A.prototype)
 * Object.setPrototypeOf(B, A)
 * const b = new B()
 */

// extends关键字后面可以跟多种类型的值。只要是一个有prototype属性的函数，就能被继承。由于函数都有prototype属性（除了Function.prototype函数），因此可以是任意函数。
// 子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class ColorPoint extends Point {
    constructor(x, y, color) {
        super(x, y)
        this.color = color
    }
}

var p1 = new Point(2, 3)
var p2 = new ColorPoint(2, 3, 'red')
console.log(Object.getPrototypeOf(p2) === Object.getPrototypeOf(p1)) // false
console.log(Object.getPrototypeOf(Object.getPrototypeOf(p2)) === Object.getPrototypeOf(p1)) // true

Object.getPrototypeOf(Object.getPrototypeOf(p2)).printName = () => {
    console.log('Ha')
}
p1.printName()

console.log('^'.repeat(50))

/**
 * ECMAScript的原生构造函数：
 * Boolean()
 * Number()
 * String()
 * Array()
 * Date()
 * Function()
 * RegExp()
 * Error()
 * Object()
 * 
 * 以前，这些原生构造函数是无法继承的，比如，不能自己定义一个Array的子类。
 * 因为子类无法获得原生构造函数的内部属性，通过Array.apply()或者分配给原型对象都不行。原生构造函数会忽略apply方法传入的this，也就是说，原生构造函数的this无法绑定，导致拿不到内部属性。
 */
function MyArray() {
    Array.apply(this, arguments)
}

MyArray.prototype = Object.create(Array.prototype, {
    constructor: {
        value: MyArray,
        writable: true,
        configurable: true,
        enumerable: true
    }
})

var colors = new MyArray();
colors[0] = "red";
console.log(colors.length)  // 0

colors.length = 0;
console.log(colors[0])  // red
/**
 * ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。
 * 比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性，这个内部属性无法在子类获取，导致子类的length属性行为不正常。
 */

var e = {}
console.log(Object.getOwnPropertyNames(Error))
console.log(Object.getOwnPropertyNames(Error.call(e)))
console.log(Object.getOwnPropertyNames(e))

/**
 * ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
 */
class VersionedArray extends Array {
    constructor() {
        super()
        this.history = [[]]
    }

    commit() {
        this.history.push(this.slice(0, this.length))
    }

    revert() {
        this.splice(0, this.length, ...this.history[this.history.length - 1])
    }
}

var x = new VersionedArray()
x.push(1);
x.push(2);
console.log(x)

for (let item of x) {
    console.log('item: ', item)
}

x.commit()
console.log(x)
console.log(x.history)

x.revert()
console.log(x)

/**
 * 继承Object的子类，有一个行为差异
 * 因为 ES6 改变了Object构造函数的行为，一旦发现Object方法不是通过new Object()这种形式调用，ES6 规定Object构造函数会忽略参数。
 */
class NewObj extends Object {
    constructor() {
        super(...arguments);
    }
}
var o = new NewObj({ attr: true });
console.log(o.attr === true)  // false

/**
 * Mixin模式
 * Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。
 */
function mix(...mixins) {
    class Mix {
        constructor() {
            for (let mixin of mixins) {
                copyProperties(this, new mixin()) // 拷贝实例属性
            }
        }
    }

    for (let mixin of mixins) {
        copyProperties(Mix, mixin) // 拷贝静态属性
        copyProperties(Mix.prototype, mixin.prototype) // 拷贝原型属性
    }

    return Mix
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if (key !== 'constructor' && key !== 'prototype' && key !== 'name') {
            let descriptor = Object.getOwnPropertyDescriptor(source, key)
            Object.defineProperty(target, key, descriptor)
        }
    }
}

// class DistributeEdit extends mix(Loggable, Serializable) {}