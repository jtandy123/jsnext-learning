/**
 * Class（类）作为对象的模板。通过class关键字，可以定义类。
 * ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
 * 定义“类”的方法的时候，前面不需要加上function关键字。且方法之间不需要逗号分隔。
 */
class Point {
    test() {

    }
}

console.log(Point) // [Function: Point]
console.log(typeof Point) // function，类的数据类型就是函数
console.log(Point === Point.prototype.constructor) // true，类本身就指向构造函数

/**
 * 构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。
 */

class B {}
let b = new B()
console.log(B.constructor) // [Function: Function]
console.log(b.constructor === B.prototype.constructor) // true

/**
 * 由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign方法可以很方便地一次向类添加多个方法。
 */
Object.assign(Point.prototype, {
    toString() {},
    toValue() {}
})

/**
 * 类的内部所有定义的方法，都是不可枚举的（non-enumerable），Object.assign添加到prototype的方法是可枚举的
 * 不可枚举这点与ES5不一致
 */
console.log(Object.keys(Point.prototype)) // Object.keys(obj): 自身可枚举
console.log(Object.getOwnPropertyNames(Point.prototype)) // Object.getOwnPropertyNames(obj): 自身属性（含自身不可枚举属性，但不包括Symbol值作为名称的属性）

var P = function(x,y) {}
P.prototype.toString = function() {}

console.log(Object.keys(P.prototype))
console.log(Object.getOwnPropertyNames(P.prototype))

console.log('-'.repeat(50))

/**
 * constructor方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。
 * 一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加。
 * constructor方法默认返回实例对象（即this），完全可以指定返回另外一个对象。
 */

 class Foo {
     constructor() {
         return Object.create(null)
     }
 }

 console.log(new Foo() instanceof Foo) // false

 /**
  * 类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。
  * 与 ES5 一样，实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
  * 与 ES5 一样，类的所有实例共享一个原型对象。
  * 可以通过实例的__proto__属性为“类”添加方法。
  * __proto__ 并不是语言本身的特性，这是各大厂商具体实现时添加的私有属性，虽然目前很多现代浏览器的 JS 引擎中都提供了这个私有属性，但依旧不建议在生产中使用该属性，避免对环境产生依赖。
  * 生产环境中，我们可以使用 Object.getPrototypeOf 方法来获取实例对象的原型，然后再来为原型添加方法/属性。
  */
// Foo() // TypeError: Class constructor Foo cannot be invoked without 'new'

/**
 * 取值函数（getter）和存值函数（setter）
 * 与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
 */
class MyClass {
    constructor() {
        // ...
    }

    get prop() {
        return 'getter'
    }

    set prop(value) {
        console.log('setter: ', value)
    }
}

let inst = new MyClass()
inst.prop = 123;
console.log(inst.prop)

/**
 * 存值函数和取值函数是设置在属性的 Descriptor 对象上的，这与 ES5 完全一致。
 */
class CustomHTMLElement {
    constructor(element) {
        this.element = element
    }

    get html() {
        return this.element.innerHTML
    }

    set html(value) {
        this.element.innerHTML = value
    }
}

var descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, 'html')
console.log('get' in descriptor) // true
console.log('set' in descriptor) // true

/**
 * 属性表达式：类的属性名，可以采用表达式。
 */
let methodName = 'getArea'

class Squares {
    constructor(length) {

    }

    [methodName]() {

    }
}

/**
 * Class表达式：与函数一样，类也可以使用表达式的形式定义。
 */
const MyClas = class Me {
    getClassName() {
        return Me.name
    }
}
const mc = new MyClas()
console.log(mc.getClassName()) // Me, 这个类的名字是Me，但是Me只在 Class 的内部可用，指代当前类。在 Class 外部，这个类只能用MyClass引用。

// 如果类的内部没用到的话，可以省略Me，也就是可以写成下面的形式。
const MyC = class {

}

console.log('name: ', MyC.name)

// 采用 Class 表达式，可以写出立即执行的 Class。
let person = new class {
    constructor(name) {
        this.name = name
    }

    sayName() {
        console.log(this.name)
    }
}('Andy')

person.sayName()

/**
 * 注意点：
 * 1. 严格模式
 * 类和模块的内部，默认就是严格模式，所以不需要使用use strict指定运行模式。
 * 
 * 2. 不存在提升
 * 类不存在变量提升（hoist），这一点与 ES5 完全不同。
 * new Foo() // ReferenceError
 * class Foo {}
 * 
 * 3. name属性
 * 本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性。
 * name属性总是返回紧跟在class关键字后面的类名。
 * 
 * 4. Generator方法
 * 如果某个方法之前加上星号（*），就表示该方法是一个 Generator 函数。
 * 
 * 5. this的指向
 * 类的方法内部如果含有this，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。
 * 解决办法：a. 在构造方法中绑定this；b. 使用箭头函数；c. 使用Proxy，获取方法的时候，自动绑定this
 * 
 * 
 */
class Logger {
    constructor() {
        // this.printName = this.printName.bind(this)
        // this.printName = (name = 'there') =>  this.print(`Hello ${name}`)
    }

    printName(name = 'there') {
        this.print(`Hello ${name}`)
    }

    print(text) {
        console.log(text)
    }
}

const logger = new Logger()
const { printName } = logger
// printName() // TypeError: Cannot read property 'print' of undefined

function selfish (target) {
    const cache = new WeakMap()
    const handler = {
        get (target, key) {
            const value = Reflect.get(target, key)
            if (typeof value !== 'function') {
                return value
            }
            if (!cache.has(value)) {
                cache.set(value, value.bind(target))
            }
            return cache.get(value)
        }
    }
    const proxy = new Proxy(target, handler)
    return proxy
}

const log = selfish(new Logger())
const {printName: pn} = log
// pn()

console.log('*'.repeat(50))

/**
 * 静态方法：方法前添加static关键字，表示该方法不会被实例继承，而是直接通过类来调用
 * 如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
 * 如果静态方法包含this关键字，这个this指的是类，而不是实例。
 * 静态方法可以与非静态方法重名
 * 父类的静态方法，可以被子类继承。静态方法也是可以从super对象上调用的。
 */

 class FooClass {
     static bar() {
         this.baz()
     }

     static baz() {
         console.log('hello')
     }

     baz() {
         console.log('world')
     }
 }

 FooClass.bar()

 class Bar {
     static classMethod() {
         return 'hello'
     }
 }

 class Baz extends Bar {
     static classMethod() {
         return super.classMethod() + ', too'
     }
 }

 console.log(Baz.classMethod())

 /**
  * 实例属性的新写法：实例属性除了定义在constructor()方法里面的this上面，也可以定义在类的最顶层。
  */
class IncreaseingCounter {
    _count = 0

    get value() {
        console.log('Getting the current value!')
        return this._count
    }

    increment() {
        this._count++
    }
}

/**
 * 静态属性：Class 本身的属性，即Class.propName，而不是定义在实例对象（this）上的属性。
 * 目前，只有这种写法可行，因为 ES6 明确规定，Class 内部只有静态方法，没有静态属性。
 * 现在有一个提案提供了类的静态属性，写法是在实例属性的前面，加上static关键字。新写法是显式声明（declarative）,而不是赋值处理，语义更好
 */
class F {}
F.prop = 1
console.log(F.prop)

/**
 * 私有方法和私有属性：是只能在类的内部访问的方法和属性，外部不能访问。
 * 一种做法是在命名上加以区别，方法名前加下划线
 * 另一种方法就是索性将私有方法移出模块，因为模块内部的所有方法都是对外可见的
 * 还有一种方法是利用Symbol值的唯一性，将私有方法的名字命名为一个Symbol值
 */
const barr = Symbol('bar')
const snaff = Symbol('snaf')

class myClass {
    // 公有方法
    foo(baz) {
        this[bar](baz)
    }

    // 私有方法
    [barr](baz) {
        return this[snaff] = baz
    }
} // Reflect.ownKeys()依然可以拿到它们

const instance = new myClass()
console.log(Reflect.ownKeys(myClass.prototype))

/**
 * 私有属性：目前，有一个提案，为class加了私有属性。方法是在属性名之前，使用#表示
 * class IncreasingCounter {
 *   #count = 0;
 *   get value() {
 *     console.log('Getting the current value!');
 *     return this.#count;
 *   }
 *   increment() {
 *     this.#count++;
 *   }
 * }
 * 
 * 之所以要引入一个新的前缀#表示私有属性，而没有采用private关键字，是因为 JavaScript 是一门动态语言，没有类型声明，使用独立的符号似乎是唯一的比较方便可靠的方法，能够准确地区分一种属性是否为私有属性。
 * 另外，Ruby 语言使用@表示私有属性，ES6 没有用这个符号而使用#，是因为 @ 已经被留给了 Decorator。
 * 
 * 这种写法不仅可以写私有属性，还可以用来写私有方法。
 * 另外，私有属性也可以设置 getter 和 setter 方法。
 * 私有属性不限于从this引用，只要是在类的内部，实例也可以引用私有属性。
 * 私有属性和私有方法前面，也可以加上static关键字，表示这是一个静态的私有属性或私有方法。
 */
/*
class P {
    #x
    #a
    #b

    constructor(x = 0, a, b) {
        this.#x = +x
        this.#a = a
        this.#b = b
    }

    get x() {
        return this.#x
    }

    set x(value) {
        this.#x = +value
    }

    #sum() {
        return #a + #b
    }
}
*/

console.log('%'.repeat(50))

/**
 * new是从构造函数生成实例对象的命令。ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。
 * 如果构造函数不是通过new命令或Reflect.construct()调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
 * Class 内部调用new.target，返回当前 Class
 * 子类继承父类时，new.target会返回子类。利用这个特点，可以写出不能独立使用、必须继承后才能使用的类
 */
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('Shape class can not instantiate')
        }
    }
}

class Rectangle extends Shape {
    constructor(length, width) {
        super()
        console.log(new.target === Rectangle)
    }
}

class Square extends Rectangle {
    constructor(length) {
        super(length, length)
    }
}

var obj = new Shape(3)

