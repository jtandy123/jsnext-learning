/**
 * Symbol.hasInstance
 * 对象的Symbol.hasInstance属性，执向一个内部方法。当其他对象使用instanceof运算符，判断是否为该对象的实例时，会调用这个方法。
 * 比如，foo instanceof Foo在语言内部，实际调用的是Foo[Symbol.hasInstance](foo)。
 */
console.log('----------------------------- 1. Symbol.hasInstance --------------------------')

class MyClass {
  // constructor() {
  //   this[Symbol.hasInstance] = (foo) => foo instanceof Array;
  // }

  static [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }

  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}

// MyClass.prototype[Symbol.hasInstance] = (foo) => foo instanceof Array;

console.log([1,2,3] instanceof new MyClass()); // true
console.log([1,2,3] instanceof MyClass); // true

class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}

const Even2 = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
};

console.log(1 instanceof Even); // false
console.log(2 instanceof Even); // true
console.log(12345 instanceof Even); // false

console.log('----------------------------- 2. Symbol.isConcatSpreadable --------------------------')
/**
 * Symbol.isConcatSpreadable
 * 对象的Symbol.isConcatSpreadable属性等于一个布尔值，表示该对象用于Array.prototype.concat()时，是否可以展开
 * 数组的默认行为是可以展开
 * 类似数组的对象的默认行为是不展开。当Symbol.isConcatSpreadable属性设为true。才可以展开。
 */
let arr1 = ['c', 'd'];
console.log(['a', 'b'].concat(arr1, 'e')); // ['a', 'b', 'c', 'd', 'e']
console.log(arr1[Symbol.isConcatSpreadable]); // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
console.log(['a', 'b'].concat(arr2, 'e')); // ['a', 'b', ['c','d'], 'e']

let obj = {length: 2, 0: 'c', 1: 'd'};
console.log(['a', 'b'].concat(obj, 'e')); // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
console.log(['a', 'b'].concat(obj, 'e')); // ['a', 'b', 'c', 'd', 'e']

class A1 extends Array {
  constructor(...args) {
    super(...args);
    // this[Symbol.isConcatSpreadable] = true;
  }
}

class A2 extends Array {
  constructor(...args) {
    super(...args);
  }

  get [Symbol.isConcatSpreadable]() {
    return false;
  }
}

let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
console.log([1, 2].concat(a1).concat(a2)); // [1, 2, 3, 4, [5, 6]]

console.log('---------------------------------- 3. Symbol.species ---------------------------------')
/**
 * Symbol.species
 * 对象的Symbol.species属性，指向一个构造函数。创建衍生对象时，会使用该属性。
 * 总之，Symbol.species的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数。
 * 主要用途：有些类库是在基类的基础上修改的，那么子类使用继承的方法时，可能希望返回基类的实例，而不是子类的实例。
 */

 class MyArray extends Array {
   static get [Symbol.species]() {
     return Array;
   }
 }
// 定义Symbol.species属性必须要采用get取值器，下行的方式将不会生效
// MyArray[Symbol.species] = Array;
console.log(MyArray[Symbol.species]);

 const a = new MyArray(1, 2, 3);
 const b = a.map(x => x);
 const c = a.filter(x => x > 1);

 console.log('b instanceof MyArray: ', b instanceof MyArray);
 console.log('c instanceof MyArray: ', c instanceof MyArray);
 console.log('b instanceof Array: ', b instanceof Array);
 console.log('c instanceof Array: ', c instanceof Array);

class T1 extends Promise {

}

class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}

console.log(new T1(r => r()).then(v => v) instanceof T1); // true
console.log(new T2(r => r()).then(v => v) instanceof T2); // false

console.log('---------------------------------- 4. Symbol.match --------------------------------------');
/**
 * Symbol.match
 * 对象的Symbol.match属性，指向一个函数。当执行str.match(myObject)时，如果该属性存在，会调用它，返回该方法的返回值
 * String.prototype.match(regexp)
 * 等同于
 * regexp[Symbol.match](this)
 */

 class MyMatcher {
   static [Symbol.match](string) {
     return 'hello world'.indexOf(string);
   } 
   
   [Symbol.match](string) {
     return 'hello world'.indexOf(string);
   }
 }
 
 console.log('w'.match(MyMatcher)); // 1
 console.log('e'.match(new MyMatcher())); // 1

console.log('----------------------------------- 5. Symbol.replace ------------------------------------');
/**
 * Symbol.replace
 * 对象的Symbol.replace属性，指向一个方法，当该对象被String.prototype.replace方法调用时，会返回该方法的返回值
 * String.prototype.replace(searchValue, replaceValue)
 * 等同于
 * searchValue[Symbol.replace](this, replaceValue)
 */

 const x = {};
 x[Symbol.replace] = (...s) => console.log(s);

 'Hello'.replace(x, 'World'); // ['Hello', 'World']

 console.log('---------------------------------- 6. Symbol.search --------------------------------------');
 /**
  * Symbol.search
  * 对象的Symbol.search属性，指向一个方法，当该对象被String.prototype.search方法调用时，会返回该方法的返回值
  * String.prototype.search(regexp)
  * 等同于
  * regexp[Symbol.search](this)
  */

  class MySearch {
    constructor(value) {
      this.value = value;
    }

    [Symbol.search](string) {
      return string.indexOf(this.value);
    }
  }

  console.log('foobar'.search(new MySearch('foo'))); // 0

console.log('----------------------------------- 7. Symbol.split --------------------------------------');
/**
 * Symbol.split
 * 对象的Symbol.split属性，指向一个方法，当该对象被String.prototype.split方法调用时，会返回该方法的返回值
 * String.prototype.split(separator, limit)
 * 等同于
 * separator[Symbol.split](this, limit)
 */

 class MySplitter {
   constructor(value) {
     this.value = value;
   }

   [Symbol.split](string) {
    let index = string.indexOf(this.value); 
    if (index === -1) {
      return string;
    }
    return [string.substr(0, index), string.substr(index + this.value.length)];
  }
 }

 console.log('foobarfoobar'.split(new MySplitter('foo'))); // ['', 'barfoobar']

console.log('--------------------------------- 8. Symbol.iterator ------------------------------------');
/**
 * Symbol.iterator
 * 对象的Symbol.iterator属性，指向该对象的默认遍历器方法。
 * 对象进行for...of循环时，会调用Symbol.iterator方法，返回该对象的默认遍历器
 */

const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...myIterable]); // [1, 2, 3]

class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

// 1
// 2
for(let value of myCollection) {
  console.log(value); 
}

console.log('--------------------------------- 9. Symbol.toPrimitive ---------------------------------');
/**
 * Symbol.toPrimitive
 * 对象的Symbol.toPrimitive属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值
 * Symbol.toPrimitive被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。
 * - Number：该场合需要转成数值
 * - String：该场合需要转成字符串
 * - Default：该场合可以转成数值，也可以转成字符串
 */

 let object = {
   [Symbol.toPrimitive](hint) {
     switch (hint) {
       case 'number': return 123;
       case 'string': return 'str';
       case 'default': return 'default';
       default: throw new Error();
     }
   }
 };

 console.log(2 * object); // 246
 console.log(3 + object); // 3default
 console.log(object == 'default'); // true
 console.log(String(object)); // str

 console.log('------------------------------------ 10. Symbol.toStringTag -----------------------------------');
 /**
  * Symbol.toStringTag
  * 对象的Symbol.toStringTag属性，指向一个字符串。
  * 在该对象上面调用Object.prototype.toString方法时，如果这个属性存在，它的返回值会出现在toString方法返回的字符串之中，表示对象的类型。
  * 这个属性可以用来定制[object Object]或[object Array]中object后面的那个字符串。
  */

  console.log({[Symbol.toStringTag]: 'Foo'}.toString()); // [object Foo]
  console.log({[Symbol.toStringTag](){return 'Foo'}}.toString()); // [object Object]

  class Collections {
    constructor() {
      // this[Symbol.toStringTag] = 'yyy';
    }

    // get [Symbol.toStringTag]() {
    //   return 'xxx';
    // }
  }

  Collections.prototype[Symbol.toStringTag] = 'xxx';

  let xx = new Collections();
  console.log(Object.prototype.toString.call(xx)); // [object xxx]

  console.log(Symbol[Symbol.toStringTag]); // undefined
  console.log(Symbol.prototype[Symbol.toStringTag]); // Symbol
  console.log(Promise[Symbol.toStringTag]); // undefined

 console.log('------------------------------------ 11. Symbol.unscopables -----------------------------------')
 /**
  * Symbol.unscopables
  * 对象的Symbol.unscopables属性，指向一个对象。该对象指定了使用with关键字时，哪些属性会被with环境排除。
  */

  console.log(Object.keys(Array.prototype[Symbol.unscopables])); // ["copyWithin", "entries", "fill", "find", "findIndex", "includes", "keys", "values"]

  // 没有unscopables
  class C {
    foo() {return 1;}

    // get [Symbol.unscopables]() {
    //   return {
    //     foo: true
    //   };
    // }
  }

  var foo = () => 2;

  with(C.prototype) {
    console.log(foo()); // 1
  }

  // 有unscopables
  C.prototype[Symbol.unscopables] = {
    foo: true
  }

   with(C.prototype) {
    console.log(foo()); // 2
  }

  console.log(global);
  // debugger;