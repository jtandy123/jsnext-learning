/**
 * ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。
 * CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。这种加载称为“运行时加载”
 * 因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”
 * 
 * ES6模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入
 * 
 */
// 整体加载fs模块（即加载fs的所有方法），生成一个对象，然后再从这个对象上面读取方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致无法在编译时做“静态优化”
// let {stat, exists, readFile} = require('fs')
// 只加载下面3个方法，其他方法不加载，“编译时加载”或者静态加载
// import {stat, exists, readFile} from 'fs'
// 没法引用ES6模块本身，因为它不是对象

/*
由于 ES6 模块是编译时加载，使得静态分析成为可能。
有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。
除了静态加载带来的各种好处，ES6 模块还有以下好处:
- 不再需要UMD模块格式了，将来服务器和浏览器都会支持 ES6 模块格式。目前，通过各种工具库，其实已经做到了这一点。
- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者navigator对象的属性。
- 不再需要对象作为命名空间（比如Math对象），未来这些功能可以通过模块提供。

ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";。
严格模式主要有以下限制。

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用with语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀 0 表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
- eval不会在它的外层作用域引入变量
- eval和arguments不能被重新赋值
- arguments不会自动反映函数参数的变化
- 不能使用arguments.callee
- 不能使用arguments.caller
- 禁止this指向全局对象
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 增加了保留字（比如protected、static和interface）

ES6 模块之中，顶层的this指向undefined，即不应该在顶层代码使用this。
*/

// export命令用于规定模块的对外接口，import命令用于输入其他模块提供的功能。
// 一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取模块内部的某个变量，就必须使用export关键字输出该变量。
// import命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名，必须与被导入模块对外接口的名称相同。
// 如果想为输入的变量重新取一个名字，import命令要使用as关键字，将输入的变量重命名。
import {firstName} from '../module/profile.mjs' // It turns out in experimental model you need to define the full path with extension.
console.log(firstName)

import {lastName} from '../module/profile.mjs'
console.log(lastName)

import {birthYear, birthYear2 as birthYear3} from '../module/profile.mjs'
console.log(birthYear) // 1989
console.log(birthYear3) // 1989

// import命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。
// 如果a是一个对象，改写a的属性是允许的。
// 并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡是输入的变量，都当作完全只读，不要轻易改变它的属性。

// import后面的from指定模块文件的位置，可以是相对路径，也可以是绝对路径，.js后缀可以省略。
// 如果只是模块名，不带有路径，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。

// import命令具有提升效果，会提升到整个模块的头部，首先执行。
// import命令是编译阶段执行的，在代码运行之前。
console.log(year) // 1989
import {year} from '../module/profile.mjs'

// 由于import是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。
// import语句是 Singleton 模式。如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。

// 除了指定加载某个输出值，还可以使用整体加载，即用星号（*）指定一个对象，所有输出值都加载在这个对象上面。
// 模块整体加载所在的那个对象（上例是circle），应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。
import * as profile from '../module/profile.mjs'
console.log(profile)
// setTimeout(() => console.log(profile.foo), 1000) // baz

import testDefault from '../module/export-default.mjs'
console.log(testDefault) // [Function: MyClass]

import * as p from '../module/profile.mjs'
console.log('p.default: ', p.default)

import * as atest from '../module/atest.mjs'
console.log('atest: ', atest)

console.log('&'.repeat(50))

/*
1. import和export命令只能在模块的顶层
2. nodejs的require是运行时加载模块，到底加载哪一个模块，只有运行时才知道
3. 提案建议引入import()函数，完成动态加载。import()返回一个Promise对象。
import()函数可以用在任何地方，非模块的脚本也可以使用。它是运行时执行，什么时候运行到这一句，就会加载指定的模块。
import()函数与所加载的模块没有静态连接关系，这点也是与import语句不相同。
import()类似于 Node 的require方法，区别主要是前者是异步加载，后者是同步加载。

import()使用场合：
- 按需加载
button.addEventListener('click', event => {
    import('./dialogBox.js').then(dialogBox => {
        dialogBox.open()
    }).catch(error => {
        // error handling
    })
})

- 条件加载
if (condition) {
    import('moduleA').then(...)
} else {
    import('moduleB').then(...)
}

- 动态的模块路径
import(f()).then(...)

注意点：
1. import()加载模块成功以后，这个模块会作为一个对象，当作then方法的参数。因此，可以使用对象解构赋值的语法，获取输出接口。
import('./myModule.js').then(({export1, export2}) => {
    // ...
})

// 如果模块有default输出接口，可以用参数直接获得
import('./myModule.js').then(myModule => {
  console.log(myModule.default);
});
import('./myModule.js').then(({default: theDefault}) => {
  console.log(theDefault);
});

// 同时加载多个模块
Promise.all([
  import('./module1.js'),
  import('./module2.js'),
  import('./module3.js'),
])
.then(([module1, module2, module3]) => {
   // ···
});

async function main() {
  const myModule = await import('./myModule.js');
  const {export1, export2} = await import('./myModule.js');
  const [module1, module2, module3] =
    await Promise.all([
      import('./module1.js'),
      import('./module2.js'),
      import('./module3.js'),
    ]);
}
main();
*/
