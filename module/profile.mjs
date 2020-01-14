console.log('profile.js')
var firstName = 'Andy'
var lastName = 'Jiang'
var year = 1989

export var age = 30

export function multiply(x, y) {
    return x * y
}

export {firstName, lastName, year, year as birthYear, year as birthYear2}

/*
export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系
在接口名与模块内部变量之间，建立了一一对应的关系。

// 报错
export 1;

// 报错
var m = 1;
export m;

export语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。
这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新。
*/
export var foo = 'bar'
setTimeout(() => foo = 'baz', 500)

/*
export命令可以出现在模块的任何位置，只要处于模块顶层就可以。
如果处于块级作用域内，就会报错，import命令也是如此。
这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。
*/

// 注意，export *命令会忽略circle模块的default方法。
export * from '../module/export-default.mjs'

import * as constants from '../module/constants.mjs'
console.log('constants A in profile: ', constants.A)
console.log('constants B in profile: ', constants.B)

import * as atest from '../module/atest.mjs'
console.log('atest: ', atest)