// function foo () {
//     console.log('foo')
// }

// export default foo;

// var a = 1
// export default a // export default a的含义是将变量a的值赋给变量default

/*
本质上，export default就是输出一个叫做default的变量或方法，然后系统允许你为它取任意名字。
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
*/
// 正是因为export default命令其实只是输出一个叫做default的变量，所以它后面不能跟变量声明语句。
// 因为export default命令的本质是将后面的值，赋给default变量，所以可以直接将一个值写在export default之后。

// export default 42 // 指定对外接口为default

// export 42 // 没有指定对外的接口

// import _, { each, forEach } from 'lodash';
/*
// 对应的export如下
export default function (obj) {
  // ···
}

export function each(obj, iterator, context) {
  // ···
}
export { each as forEach };
*/

// export default也可以用来输出类。
/*
// MyClass.js
export default class { ... }

// main.js
import MyClass from 'MyClass';
let o = new MyClass();
*/
class MyClass {

}

export default MyClass

export var foo = 'foo'

// export和import的复合写法
// 如果在一个模块之中，先输入后输出同一个模块，import语句可以与export语句写在一起。
/*
export { foo, bar } from 'my_module';

// 可以简单理解为
import { foo, bar } from 'my_module';
export { foo, bar };

// 写成一行以后，foo和bar实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用foo和bar。

export { foo as myFoo } from 'my_module'; // 接口改名
export * from 'my_module'; // 模块整体输出
export { default } from 'foo'; // 默认接口
export { es6 as default } from './someModule'; // 具名接口改为默认接口
export { default as es6 } from './someModule'; // 默认接口改为具名接口
*/
/*
// 下面三种import语句，没有对应的复合写法。
import * as someIdentifier from "someModule";
import someIdentifier from "someModule";
import someIdentifier, { namedIdentifier } from "someModule";
*/

import * as constants from '../module/constants.mjs'
console.log('constants A in export-default: ', constants.A)
console.log('constants B in export-default: ', constants.B)

// import * as atest from '../module/atest.mjs'
// console.log('atest: ', atest)