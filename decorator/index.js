/*
1. 类的装饰 --- 装饰器可以用来装饰整个类
@decorator
class A {}
// 等同于
class A {}
A = decorator(A) || A;
// 装饰器是一个对类进行处理的函数。装饰器函数的第一个参数，就是所要装饰的目标类。
// 如果觉得一个参数不够用，可以在装饰器外面再封装一层函数。

function testable(isTestable) {
  return function(target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false

注意，装饰器对类的行为的改变，是代码编译时发生的，而不是在运行时。这意味着，装饰器能在编译阶段运行代码。也就是说，装饰器本质就是编译时执行的函数。
*/
function testable(target) {
  target.prototype.isTestable = true;
}

@testable
class MyTestableClass {}
let obj = new MyTestableClass();
console.log(obj.isTestable);


import {mixins} from './mixins';
const Foo = {
  foo() {
    console.log('foo');
  }
};

@mixins(Foo)
class MyClass {}

let object = new MyClass();
object.foo();

console.log('@'.repeat(50));

/*
实际开发中，React 与 Redux 库结合使用时，常常需要写成下面这样。
class MyReactComponent extends React.Component {}

export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);

有了装饰器，就可以改写上面的代码。
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
*/

/*
方法的修饰

*/
class Person {
  @readonly
  name() {
    return `${this.first} ${this.last}`;
  }

  @nonenumerable
  get kidCount() { return this.children.length; }
}

/**
 * 装饰器函数readonly一共可以接受三个参数
 * @param {*} target 装饰器第一个参数是类的原型对象, Person.prototype
 * 装饰器的本意是要“装饰”类的实例，但是这个时候实例还没生成，所以只能去装饰原型（这不同于类的装饰，那种情况时target参数指的是类本身）
 * 
 * @param {*} name 第二个参数是所要装饰的属性名
 * @param {*} descriptor 第三个参数是该属性的描述对象
 * 
 * readonly(Person.prototype, 'name', descriptor);
 * 类似于
 * Object.defineProperty(Person.prototype, 'name', descriptor);
 * 
 * 装饰器（readonly）会修改属性的描述对象（descriptor），然后被修改的描述对象再用来定义属性。
 */
function readonly(target, name, descriptor) {
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

function nonenumerable(target, name, descriptor) {
  descriptor.enumerable = false;
  return descriptor;
}

/*
core-decorators
traits-decorator
*/
