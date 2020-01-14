'use strict'
{
  let a = 10
  var b = 1
}

// console.log(a); // ReferenceError: a is not defined.
console.log(b)

console.log('-----------------------------------')

for (let i = 0; i < 10; i++) {
  console.log(i)
}

// console.log(i); // ReferenceError: i is not defined.

console.log('-----------------------------------')

var a = []
for (let i = 0; i < 10; i++) {
  a[i] = function () {
    console.log(i)
  }
}
a[6]() // 6

console.log('-----------------------------------')

for (let i = 0; i < 3; i++) {
  let i = 'abc'
  console.log(i)
}

// abc
// abc
// abc

console.log('-----------------------------------')

/**
 * 暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量
 */
var tmp = 123

if (true) {
  // tmp = 'abc'; // ReferenceError, temporal dead zone, TDZ
  let tmp
  console.log(tmp)
}

console.log('-----------------------------------')

if (true) {
  // TDZ开始
  // tmp = 'abc' // ReferenceError
  // console.log(tmp) // ReferenceError

  //   typeof tmp // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp) // undefined

  tmp = 123
  console.log(tmp) // 123
}

console.log('-----------------------------------')

function bar (x = 3 , y = x) {
  return [x, y]
}

bar()

console.log('-----------------------------------')

function f1 () {
  let n = 5
  if (true) {
    let n = 10
  }
  console.log(n) // 5
}

f1()

console.log('-----------------------------------')

{
  {
    {
      {
        {
          let insane = 'Hello World'
        }
      // console.log(insane)
      }
    }
  }
}

console.log('-----------------------------------')

/**
 * 块级作用域的出现，实际上使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了
 */
;(function () {
  console.log('test')
}())

+ function () {
  var tmp = 'tmp'
  console.log('tmp')
}()

{
  let tmp = 'tmp'
  console.log(tmp)
}

console.log('-----------------------------------')

function foo () { console.log('I am outside'); }

(function () {
  {
    function foo () { console.log('I am inside!'); }
    foo()
  }

  foo()
}())

console.log('-----------------------------------')

if (true) {
  function f () { console.log('f()') }
}

// f() // ReferenceError: f is not defined

// if (true) 
//     function f() { console.log('f2()') } // In strict mode code, functions can only be declared at top level or inside a block.

// f()

console.log('-----------------------------------')

const PI = 3.1415
console.log(PI)
// PI = 3; // TypeError: Assignment to constant variable.

// const foo; // SyntaxError: Missing initializer in const declaration

console.log('-----------------------------------')

const foo1 = Object.freeze({})
// foo1.prop = 123; // TypeError:Cannot add property prop, object is not extensible.
console.log(foo1.prop)

console.log('-----------------------------------')

/**
 * 声明变量的6种方法：var, function, let, const, import, class 
 */

 // 方法一
 const win = (typeof window !== 'undefined' ?
   window :
   (typeof process === 'object' &&
     typeof require === 'function' &&
     typeof global === 'object') ?
   global :
   this);

 // 方法二
 var getGlobal = function () {
   if (typeof self !== 'undefined') {
     return self;
   }
   if (typeof window !== 'undefined') {
     return window;
   }
   if (typeof global !== 'undefined') {
     return global;
   }
   throw new Error('unable to locate global object');
 };

 var aa = 1;
 console.log(win === global); // true
 console.log(this === module.exports); // true
 console.log(this === exports); // true
 console.log(win.aa);

 let bb = 1;
 console.log(win.bb);

 // global-this: globalThis
 (function (Object) {
  typeof globalThis !== 'object' && (
    this ?
      get() :
      (Object.defineProperty(Object.prototype, '_T_', {
        configurable: true,
        get: get
      }), _T_)
  );
  function get() {
    'use strict';
    console.log(this);
    this.globalThis = this;
    delete Object.prototype._T_;
  }
}(Object));

console.log(globalThis === global); // true
