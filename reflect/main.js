/*
 1. 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。从Reflect对象上可以拿到语言内部的方法
 2. 修改某些Object方法的返回结果，让其变得更合理
 3. 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为
 4. Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。
 */

(function () {
    const loggedObj = new Proxy({}, {
        get(target, name) {
            console.log('get', target, name);
            return Reflect.get(target, name);
        },
        deleteProperty(target, name) {
            console.log('delete', name);
            return Reflect.deleteProperty(target, name);
        },
        has(target, name) {
            console.log('has', name);
            return Reflect.has(target, name);
        }
    });

    console.log(Reflect.apply(Math.floor, undefined, [1.75])); // 1
}());


/*
Reflect.get(target, name, receiver) 返回target对象的name属性，若name属性部署了读取函数，则读取函数的this绑定receiver
 */
(function () {
    const myObj = {
        foo: 1,
        bar: 2,
        get baz() {
            return this.foo + this.bar;
        }
    };

    const myReceiveObj = {
        foo: 6,
        bar: 6
    };
    console.log(Reflect.get(myObj, 'baz')); // 3
    console.log(Reflect.get(myObj, 'baz', myReceiveObj)); // 12
}());

/*
Reflect.set(target, name, value, receiver) 设置target对象的name属性等于value，如果name属性设置了赋值函数，则赋值函数的this绑定receiver
如果 Proxy 对象和 Reflect 对象联合使用，前者拦截赋值操作，后者完成赋值的默认行为，而且传入了receiver，那么Reflect.set会触发Proxy.defineProperty拦截
 */
(function () {
    const p = {a: 'a'};
    const handler = {
        set (...args) { // target, key, value, receiver
            console.log('set');
            Reflect.set(...args);
        },
        defineProperty(...args) {
            console.log('defineProperty');
            Reflect.defineProperty(...args);
        }
    };
    const proxy = new Proxy(p, handler);
    proxy.a = 'A';
    // set
    // defineProperty
}());

/*
Reflect.has(obj, name) 对应name in obj里面的in运算符
判断范围包括自身和继承的所有属性，也包括不可枚举的属性
 */
const myObject = {foo: 1};
console.log(Reflect.has(myObject, 'foo')); // true

/*
Reflect.deleteProperty(obj, name) 等同于delete obj[name], 用于删除对象的属性
如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false
 */
console.log(Reflect.deleteProperty(myObject, 'test')); // true

/*
Reflect.construct(target, args) 等同于new target(...args)，提供一种不使用new调用构造函数的方法
 */
function Greeting(name) {
    this.name = name;
}

const instance = Reflect.construct(Greeting, ['Karry']);
console.log(instance.name); // Karry

/*
Reflect.getPrototypeOf(obj) 用于读取对象的__proto__属性，对应Object.getPrototypeOf(obj)
Reflect.setPrototypeOf(obj, newProto) 用于设置对象的__proto__属性，返回第一个参数对象，对应Object.setPrototypeOf(obj, newProto)
如果第一个参数不是对象，Object.setPrototypeOf会返回第一个参数本身，而Reflect.setPrototypeOf会报错
如果第一个参数是undefined或null，Object.setPrototypeOf和Reflect.setPrototypeOf都会报错
 */
console.log(Reflect.getPrototypeOf(instance) === Greeting.prototype); // true
const a = {};
Reflect.setPrototypeOf(instance, a);
console.log(Reflect.getPrototypeOf(instance) === a); // true

/*
Reflect.apply(func, thisArg, args) 方法等同于Function.prototype.apply.call(func, thisArg, args), 用于绑定this对象后执行给定函数
一般来说，如果要绑定一个函数的this对象，可以这样写fn.apply(obj, args)，
但是如果函数定义了自己的apply方法，就只能写成Function.prototype.apply.call(fn, obj, args)，采用Reflect对象可以简化这种操作
 */
const ages = [11, 33, 12, 54, 18, 96];
const youngest = Reflect.apply(Math.min, Math, ages);
const oldest = Reflect.apply(Math.max, Math, ages);
const type = Reflect.apply(Object.prototype.toString, youngest, []);
console.log(youngest); // 11
console.log(type); // [object Number]

/*
Reflect.defineProperty(target, propertyKey, attributes)
基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除
如果Reflect.defineProperty的第一个参数不是对象，就会抛出错误
 */
const p = new Proxy({}, {
    defineProperty(target, prop, descriptor) {
        console.log(descriptor); // { value: 'bar', writable: true, enumerable: true, configurable: true }
        return Reflect.defineProperty(target, prop, descriptor);
    }
});

p.foo = 'bar';
console.log(p.foo); // bar

/*
Reflect.getOwnPropertyDescriptor(target, propertyKey)
基本等同于Object.getOwnPropertyDescriptor，用于得到指定属性的描述对象，将来会替代掉后者
如果第一个参数不是对象，Object.getOwnPropertyDescriptor(1, 'foo')不报错，返回undefined，而Reflect.getOwnPropertyDescriptor(1, 'foo')会抛出错误，表示参数非法
 */
const mo = {};
Reflect.defineProperty(mo, 'hidden', {
    value: true,
    enumerable: false
});
const theDescriptor = Reflect.getOwnPropertyDescriptor(mo, 'hidden');
console.log(theDescriptor);

/*
Reflect.isExtensible(target) 方法对应Object.isExtensible，返回一个布尔值，表示当前对象是否可扩展
如果参数不是对象，Object.isExtensible会返回false，因为非对象本来就是不可扩展的，而Reflect.isExtensible会报错

Reflect.preventExtensions(target)
对应Object.preventExtensions方法，用于让一个对象变为不可扩展。它返回一个布尔值，表示是否操作成功
如果参数不是对象，Object.preventExtensions在 ES5 环境报错，在 ES6 环境返回传入的参数，而Reflect.preventExtensions会报错

Reflect.ownKeys(target) 返回对象的所有属性，基本等同于Object.getOwnPropertyNames与Object.getOwnPropertySymbols之和
 */
const myo = {
    foo: 1,
    bar: 2,
    [Symbol.for('baz')]: 3,
    [Symbol.for('bing')]: 4
};
console.log(Reflect.ownKeys(myo)); // [ 'foo', 'bar', Symbol(baz), Symbol(bing) ]






































