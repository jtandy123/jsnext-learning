/**
 * 异步编程方法：
 * - 回调函数
 * - 事件监听
 * - 发布/订阅
 * - Promise对象
 * - Generator函数
 * 
 * 所谓异步，简单说就是一个任务不是连续完成的。
 * 
 * 面试题：
 * 为什么 Node 约定，回调函数的第一个参数，必须是错误对象err（如果没有错误，该参数就是null）？
 * 原因是执行分成两段，第一段执行完以后，任务所在的上下文环境就已经结束了。在这以后抛出的错误，原来的上下文环境已经无法捕捉，只能当作参数，传入第二段。
 * 
 * Promise 的最大问题是代码冗余，原来的任务被 Promise 包装了一下，不管什么操作，一眼看去都是一堆then，原来的语义变得很不清楚。
 * 
 * 协程运行流程大致如下：
 * 第一步，协程A开始执行。
 * 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
 * 第三步，（一段时间后）协程B交还执行权。
 * 第四步，协程A恢复执行。
 * 协程A就是异步任务
 * 
 * Generator函数最大特点就是可以交出函数的执行权（即暂停执行）
 * 整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用yield语句注明。
 */

 var fetch = require('node-fetch')
 function* gen() {
     var url = 'https://api.github.com/users/github'
     var result = yield fetch(url)
     console.log(result.bio) // How people build software.
 }

 var g = gen()
 var result = g.next() // 执行第一阶段
 result.value.then((data) => {
     return data.json()
 }).then((data) => {
     g.next(data) // 执行第二阶段
 })
 // 虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）

 /**
  * 编译器的“传名调用”实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。
  * 它是“传名调用”的一种实现策略，用来替换某个表达式。
  * 
  * JavaScript 语言是传值调用，它的 Thunk 函数含义有所不同。
  * 在 JavaScript 语言中，Thunk 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。
  * 任何函数，只要参数有回调函数，就能写成 Thunk 函数的形式。
  */
 var Thunk = function (fn) {
     return function () {
         var args = Array.prototype.slice.call(arguments)
         return function (callback) {
             args.push(callback)
             return fn.apply(this, args)
         }
     }
 }

 const Thunker = function (fn) {
     return function (...args) {
         return function (callback) {
             return fn.call(this, ...args, callback)
         }
     }
 }

 function f(a, cb) {
     cb(a)
 }
 var ft = Thunk(f)
 ft(1)(console.log) // 1

 console.log('-----------------------')

 var thunkify = require('thunkify')
 var fs = require('fs')

 var read = thunkify(fs.readFile)

 read('../post.json')(function(err, buffer) {
     if (err) {
         console.log(err)
         return
     }
     console.log(buffer) // <Buffer 7b 0a 20 20 22 63 6f 64 65 22 3a 20 31 30 30 30 30 0a 7d 0a>
 })

 console.log('---------------------')
 function foo(a, b, callback) {
     console.log('a: ', a, ", b: ", b, ", callback: ", callback)
     var sum = a + b
     callback(sum)
     callback(sum)
 }

 var fth = thunkify(foo)
 var print = console.log.bind(console)
 fth(1, 2)(print)
 
 console.log('----------------------')

 // Thunk函数转换器
 const thunk = (fn) => (...args) => (callback) => fn.call(this, ...args, callback)

 /**
  * thunk函数可以用于Generator函数的自动流程管理，前提是每一个异步操作都必须是thunk函数
  * 即跟在yield命令后面的必须是thunk函数
  */
/**
 * 
 * @param {*} fn Generator函数 
 */
 function run(fn) {
     var gen = fn()

     // thunk的回调函数
     function callback(err, data) {
         var result = gen.next(data)
         if (result.done) return
         result.value(callback)
     }

     callback()
 }