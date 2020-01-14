// meta programming
// 在目标对象之前架设一层“拦截”, 外界访问对象，必须先通过这层拦截，因此提供一种机制，可对外界的访问进行过滤和改写

const obj = new Proxy({}, {
    get(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});

obj.count = 1;
// setting count!

++obj.count;
// getting count!
// setting count!

console.log(obj.count);
// getting count!
// 2

// var proxy = new Proxy(target, handler);

const proxy = new Proxy({'a': 1}, {
    get(target, property) {
        return 35;
    },
    ownKeys(target) {
        return ['a', 'b', 'c'];
    }
});
console.log(proxy.a); // 35
console.log(proxy.time); // 35
console.log(proxy.name); // 35

// 要使得Proxy起作用，必须针对Proxy实例进行操作，而不是针对目标对象进行操作
const [target, handler] = [{}, {}]; // Cannot create proxy with a non-object as target or handler
const p = new Proxy(target, handler);
p.a = 'b';
console.log(target.a); // b
// handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问target

// 技巧：将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用
// var object = {proxy: new Proxy(target, handler)};
// Proxy实例也可以作为其他对象的原型对象
let objj = Object.create(proxy);
console.log(objj.title); // 35

// 同一个拦截器函数，可以设置拦截多个操作。Proxy支持13种操作
/*
get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']，receiver表示proxy实例本身（操作行为所针对的对象）
set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值
has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值
deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值
ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象
defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值
preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值
getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象
isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值
setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截
apply(target, thisBinding, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)
construct(target, args, newTarget)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)
 */

console.log(Object.keys(proxy)); // ['a'], ownKeys可以返回Object.keys(target)的子集

(function(){
    function createArray(...elements) {
        const handler = {
            get(target, propKey, receiver) {
                console.log(typeof propKey); // string
                let index = Number(propKey);
                if (index < 0) {
                    propKey = String(target.length + index);
                }
                return Reflect.get(target, propKey, receiver);
            }
        };
        return new Proxy(elements, handler);
    }
    const arr = createArray(1, 2, 3);
    console.log(arr[-1]); // 3
})();

(function() {
    const pipe = (function () {
        return function (value) {
            const funcStack = [];
            const oproxy = new Proxy({}, {
                get(pipeObject, fnName) {
                    if (fnName === 'get') {
                        return funcStack.reduce(function (val, fn) {
                            return fn(val);
                        }, value);
                    }
                    funcStack.push(global[fnName]); // window[fnName]
                    return oproxy;
                }
            });
            return oproxy;
        }
    }());

    global.double = n => n * 2;
    global.pow = n => n ** 2;
    global.reverseInt = n => n.toString().split('').reverse().join('') | 0;

    console.log(pipe(3).double.pow.reverseInt.get); // 63
}());


(function () {
    // get方法的第三个参数的例子，总是指向原始的读操作所在的那个对象，一般情况下就是Proxy实例
    const proxy = new Proxy({}, {
        get (target, property, receiver) {
            return receiver;
        }
    });

    console.log(proxy.getReceiver === proxy); // true
    const d = Object.create(proxy);
    console.log(d.a === d); // true
    // object instanceof constructor
    // instanceof 运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链
    // console.log(d instanceof proxy); // TypeError: object is not a function
}());


(function () {
    // 如果一个属性不可配置和不可写，则该属性不能被代理，通过Proxy对象访问该属性会报错
    // 如果目标对象自身的某个属性，不可写或不可配置，那么set方法将不起作用
    const obj = {};
    Object.defineProperty(obj, 'foo', {
        value: 'bar',
        writable: false
    });

    const handler = {
        set (obj, prop, value, receiver) {
            obj[prop] = value;
        }
    };

    const proxy = new Proxy(obj, handler);
    proxy.foo = 'baz';
    console.log(proxy.foo); // bar
}());

(function () {
    const target = function () {
        return 'i am the target'
    };
    const handler = {
        apply() {
            return 'i am the proxy';
        }
    };
    const p = new Proxy(target, handler); // when target is {}, TypeError: p is not a function
    console.log(p()); // i am the proxy
}());

(function () {
    const twice = {
        apply(target, ctx, args) {
            return Reflect.apply(...arguments) * 2;
        }
    };
    function sum (left, right) {
        return left + right;
    }
    const proxy = new Proxy(sum, twice);
    console.log(proxy(1, 2)); // 6
    console.log(proxy.call(null, 5, 6)); // 22
    console.log(proxy.apply(null, [7, 8])); // 30
    console.log(Reflect.apply(proxy, null, [9, 10])); // 38
}());

(function () {
    // in操作符
    const handler = {
        has(target, key) {
            return key[0] !== '_';
        }
    };
    const target = {_prop: 'foo', prop: 'foo'};
    const proxy = new Proxy(target, handler);
    console.log('_prop' in proxy); // false
}());


(function () {
    // 如果原对象不可配置或者目标对象不可扩展，has拦截会报错
    const obj = {a: 10};
    Object.preventExtensions(obj);

    const p = new Proxy(obj, {
        has(target, prop) {
            return false;
        }
    });
    // console.log('a' in p);
}());

// has方法拦截的是HasProperty操作，而不是HasOwnProperty操作，即has方法不判断一个属性是对象自身的属性，还是继承的属性
// has拦截对for...in循环不生效

(function () {
    // construct方法返回的必须是一个对象，否则会报错。
    const p = new Proxy(function () {}, {
        construct(target, args) {
            console.log('called: ' + args.join(', ')); // called: 10, 20
            return { value: args[0] * 10 };
        }
    });

    console.log((new p(10, 20)).value); // 100
}());


(function () {
    // deleteProperty方法用于拦截delete操作，如果这个方法抛出错误或者返回false，当前属性就无法被delete命令删除
    // 目标对象自身的不可配置（configurable）的属性，不能被deleteProperty方法删除，否则报错
    const handler = {
        deleteProperty(target, key) {
            invariant(key, 'delete');
            return true;
        }
    };

    function invariant (key, action) {
        if (key[0] === '_') {
            throw new Error(`Invalid attempt to ${action} private "${key}" property`);
        }
    }

    const target = {_prop: 'foo'};
    const proxy = new Proxy(target, handler);
    // delete proxy._prop; // Error: Invalid attempt to delete private "_prop" property
}());

(function () {
    // 如果目标对象不可扩展（extensible），则defineProperty不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（writable）或不可配置（configurable），则defineProperty方法不得改变这两个设置
    const handler = {
        defineProperty (target, key, descriptor) {
            return false;
        }
    };
    const target = {};
    const proxy = new Proxy(target, handler);
    proxy.foo = 'bar';
    console.log(proxy.foo); // undefined
}());

(function () {
    // getOwnPropertyDescriptor方法拦截Object.getOwnPropertyDescriptor()，返回一个属性描述对象或者undefined
    const handler = {
        getOwnPropertyDescriptor (target, key) {
            if (key[0] === '_') {
                return;
            }
            return Object.getOwnPropertyDescriptor(target, key);
        }
    };
    const target = {_foo: 'bar', baz: 'tar'};
    const proxy = new Proxy(target, handler);
    console.log(Object.getOwnPropertyDescriptor(proxy, 'wat')); // undefined
    console.log(Object.getOwnPropertyDescriptor(proxy, '_foo')); // undefined
    console.log(Object.getOwnPropertyDescriptor(proxy, 'baz')); // { value: 'tar', writable: true, enumerable: true, configurable: true }
}());

// getPrototypeOf方法主要用来拦截获取对象原型
// getPrototypeOf方法的返回值必须是对象或者null，否则报错
// 另外，如果目标对象不可扩展（extensible）， getPrototypeOf方法必须返回目标对象的原型对象
/*
Object.prototype.__proto__
Object.prototype.isPrototypeOf()
Object.getPrototypeOf()
Reflect.getPrototypeOf()
instanceof
 */
(function () {
    const proto = {};
    const p = new Proxy({}, {
        getPrototypeOf(target) {
            return proto;
        }
    });
    console.log(Object.getPrototypeOf(p) === proto); // true
}());

(function () {
    // 该方法只能返回布尔值，否则返回值会被自动转为布尔值
    // 它的返回值必须与目标对象的isExtensible属性保持一致，否则就会抛出错误
    const p = new Proxy({}, {
        isExtensible(target) {
            console.log('called'); // called
            return true;
        }
    });

    console.log(Object.isExtensible(p)); // true
    console.log(Object.isExtensible(p) === Object.isExtensible({})); // true
}());


(function () {
    /*
    ownKeys方法用来拦截对象自身属性的读取操作
    Object.getOwnPropertyNames()
    Object.getOwnPropertySymbols()
    Object.keys()
    for...in循环
     */
    const target = {
        a: 1,
        b: 2,
        c: 3,
        [Symbol.for('secret')]: 4
    };

    Object.defineProperty(target, 'key', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: 'static'
    });

    Object.defineProperty(target, Symbol.for('key'), {
        enumerable: false,
        configurable: true,
        writable: true,
        value: 'symbol'
    });

    const handler = {
      ownKeys(target) {
          return ['a', 'd', Symbol.for('secret'), 'key', Symbol.for('key')];
      }
    };

    const p = new Proxy(target, handler);
    console.log(Object.keys(p)); // [ 'a' ]
    console.log(Object.getOwnPropertySymbols(p)); // [ Symbol(secret) ]
    console.log(Object.getOwnPropertyNames(p)); // [ 'a', 'd', 'key' ]
    for (let k in p) {
        console.log('->', k); // a
    }
    /*
    使用Object.keys方法时，有三类属性会被ownKeys方法自动过滤，不会返回:
    > 目标对象上不存在的属性
    > 属性名为Symbol值
    > 不可遍历(enumerable)的属性

    使用Object.getOwnPropertySymbols方法时，将返回属性名为Symbol值的属性(包括不可遍历的Symbol值属性)

    使用Object.getOwnPropertyNames方法时，不会返回：
    > 属性名为Symbol值

    for...in 与 Object.keys一致

    ownKeys方法返回的数组成员，只能是字符串或 Symbol 值。如果有其他类型的值，或者返回的根本不是数组，就会报错。
     */
}());

(function () {
    // 如果目标对象自身包含不可配置的属性，则该属性必须被ownKeys方法返回，否则报错
    const obj = {};
    Object.defineProperty(obj, 'a', {
        configurable: false,
        enumerable: false,
        value: 10 }
    );

    const p = new Proxy(obj, {
        ownKeys: function(target) {
            return ['a', 'b'];
        }
    });

    console.log(Object.getOwnPropertyNames(p)); // ['a', 'b']
    console.log(Object.keys(p)); // []
}());


(function () {
    // 如果目标对象是不可扩展的（non-extensition），这时ownKeys方法返回的数组之中，必须包含原对象的所有属性，且不能包含多余的属性，否则报错
    const obj = {a: 1};

    Object.preventExtensions(obj);

    const p = new Proxy(obj, {
        ownKeys: function(target) {
            return ['a'];
        }
    });

    console.log(Object.getOwnPropertyNames(p)); // [ 'a' ]
}());


(function () {
    // preventExtensions方法拦截Object.preventExtensions()。该方法必须返回一个布尔值，否则会被自动转为布尔值
    // 只有目标对象不可扩展时（即Object.isExtensible(proxy)为false），proxy.preventExtensions才能返回true，否则会报错
    // 通常要在proxy.preventExtensions方法里面，调用一次Object.preventExtensions
    const p = new Proxy({}, {
        preventExtensions: function(target) {
            console.log('called'); // called
            Object.preventExtensions(target);
            return true;
        }
    });

    Object.preventExtensions(p);
}());


(function () {
    // 该方法只能返回布尔值，否则会被自动转为布尔值
    // 如果目标对象不可扩展（extensible），setPrototypeOf方法不得改变目标对象的原型
    const handler = {
        setPrototypeOf (target, proto) {
            // throw new Error('Changing the prototype is forbidden');
            Object.setPrototypeOf(target, proto);
            return true;
        }
    };
    const proto = {a: 1};
    const target = function () {};
    const proxy = new Proxy(target, handler);
    Object.setPrototypeOf(proxy, proto);
    console.log(proto.isPrototypeOf(proxy)); // true
    console.log(proxy.a); // 1
}());


(function () {
    // Proxy.revocable的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问
    // Proxy.revocable方法返回一个可取消的 Proxy 实例
    const target = {};
    const handler = {};
    const {proxy, revoke} = Proxy.revocable(target, handler);

    proxy.foo = 123;
    console.log(proxy.foo); // 123

    revoke();
    // console.log(proxy.foo); // TypeError: Cannot perform 'get' on a proxy that has been revoked
}());

/*
在 Proxy 代理的情况下，目标对象内部的this关键字会指向 Proxy 代理
 */
(function () {
    const target = new Date('2015-01-01');
    const handler = {
        get(target, prop) {
            if (prop === 'getDate') {
                return target.getDate.bind(target);
            }
            return Reflect.get(target, prop);
        }
    };
    const proxy = new Proxy(target, handler);

    console.log(proxy.getDate()); // 1
}());

// Proxy 对象可以拦截目标对象的任意属性，这使得它很合适用来写 Web 服务的客户端
// Proxy 也可以用来实现数据库的 ORM 层

/*
const service = createWebService('http://example.com/data');

service.employees().then(json => {
  const employees = JSON.parse(json);
  // ···
});

function createWebService(baseUrl) {
  return new Proxy({}, {
    get(target, propKey, receiver) {
      return () => httpGet(baseUrl+'/' + propKey);
    }
  });
}
 */















