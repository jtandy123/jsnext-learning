/**
 * async函数---Generator函数的语法糖
 * async函数就是将Generator函数的星号(*)替换成async，将yield替换成await
 * 
 * async函数：
 * 1. 内置执行器：async函数的执行，与普通函数一模一样，只要一行。
 * 2. 更好的语义：async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。
 * 3. 更广的适用性：async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）
 * 4. 返回值是Promise
 * 
 * async函数完全可以看作多个异步操作，包装成的一个Promise对象，而await命令就是内部then命令的语法糖
 * async函数返回一个 Promise 对象，可以使用then方法添加回调函数。
 * 当函数执行的时候，一旦遇到await就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。
 * 
 */

const {readFile} = require('fs')

const rFile = (fileName) => {
  return new Promise((resolve, reject) => {
    readFile(fileName, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

const asyncReadFile = async function () {
  const f1 = await rFile('./index.js')
  const f2 = await rFile('../package-lock.json')
  console.log(f1.toString())
  console.log(f2.toString())
}

console.log('<hello>')
// asyncReadFile()
console.log('<world>')

/**
 * 函数前面的async关键字，表明该函数内部有异步操作。调用该函数时，会立即返回一个Promise对象
 */
async function timeout(ms) {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function asyncPrint(value, ms) {
  await timeout(ms)
  console.log(value)
}

asyncPrint('hello world!', 50)

/**
 * async函数的多种使用形式：
 * 1. 函数声明
 * 2. 函数表达式
 * 3. 对象的方法
 * 4. Class的方法
 * 5. 箭头函数
 */
// 函数声明
async function foo() {}

// 函数表达式
const f = async function() {}

// 对象的方法
let obj = {
  async foo() {}
}
obj.foo().then(() => {})

// Class的方法
class Storage {
  constructor() {
    this.cachePromise = caches.open('avatars')
  }

  async getAvatar(name) {
    const cache = await this.cachePromise;
    return cache.match(`/avatars/${name}.jpg`)
  }
}

// const storage = new Storage()
// storage.getAvatar('jake').then(() => {})

// 箭头函数
const fo = async () => {}

console.log('==================================')

/**
 * async函数返回一个 Promise 对象。
 * async函数内部return语句返回的值，会成为then方法回调函数的参数。
 */
async function fooo() {
  return 'hello world'
}

fooo().then(v => console.log(v))

/**
 * async函数内部抛出错误，会导致返回的 Promise 对象变为reject状态。抛出的错误对象会被catch方法回调函数接收到。
 */
async function bar() {
  throw new Error('出错了')
}

bar().then(v => console.log(v), e => console.log(e))

/**
 * Promise对象的状态变化
 * async函数返回的 Promise 对象，必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。
 * 也就是说，只有async函数内部的异步操作执行完，才会执行then方法指定的回调函数。
 */

 /**
  * await命令
  * await命令后面不是一个Promise对象，就直接返回对应的值
  * await命令后面是一个thenable对象（即定义then方法的对象），await将其等同于Promise对象
  * 
  */
class Sleep {
  constructor(timeout) {
    this.timeout = timeout
  }

  then(resolve, reject) {
    const startTime = Date.now()
    setTimeout(() => resolve(Date.now() - startTime), this.timeout)
  }
}

(async () => {
  const sleepTime = await new Sleep(1000)
  console.log(sleepTime)
})()

function sleep(interval) {
  return new Promise(resolve => setTimeout(resolve, interval))
}

async function one2FiveInAsync() {
  for (let i = 1; i <= 5; i++) {
    console.log(i)
    await sleep(1000)
  }
}

one2FiveInAsync()

/**
 * await命令后面的 Promise 对象如果变为reject状态，则reject的参数会被catch方法的回调函数接收到。
 * 任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
 */
async function b() {
  await Promise.reject('出错了')
}
b().then(v => console.log(v), e => console.log('err: ', e)).catch(e => console.log('catch: ', e))

/**
 * 若想即使前一个异步操作失败，也不要中断后面的异步操作。这时可以将第一个await放在try...catch结构里面，这样不管这个异步操作是否成功，第二个await都会执行。
 * 另外一种方法是await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
 * 如果await后面的异步操作出错，那么等同于async函数返回的 Promise 对象被reject。
 */
const superagent = require('superagent')
const NUM_RETRIES = 3;

async function test() {
  let i;
  for (i = 0; i < NUM_RETRIES; ++i) {
    try {
      await superagent.get('http://google.com/this-throws-an-error')
      break;
    } catch (err) {

    }
  }
  console.log('times: ', i)
}

// test()

/**
 * async使用注意点：
 * 1. await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中，或者await后面的 Promise 对象再跟一个catch方法，处理前面可能出现的错误。
 * 2. 多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
 * // 写法一
 * let [foo, bar] = await Promise.all([getFoo(), getBar()]);
 * // 写法二
 * let fooPromise = getFoo();
 * let barPromise = getBar();
 * let foo = await fooPromise;
 * let bar = await barPromise;
 * 
 * 3. await命令只能用在async函数之中，如果用在普通函数，就会报错。
 * 4. async 函数可以保留运行堆栈。
 */

 /**
  * async函数的实现原理：将Generator函数和自动执行器包装在一个函数里
  * async function fn(args) {
  *   // ...
  * }
  * 
  * function fn(args) {
  *   return spawn(function* () {
  *    // ...
  *   });
  * }
  * 
  * spawn函数就是自动执行器
  */

  function spawn(genF) {
    return new Promise((resolve, reject) => {
      const gen = genF();
      
      function step(nextF) {
        let next
        try {
          next = nextF();
        } catch (e) {
          return reject(e)
        }

        if (next.done) return resolve(next.value)

        Promise.resolve(next.value).then(
          (v) => step(() => gen.next(v)), 
          (e) => step(() => gen.throw(e))
        )
      }

      step(() => gen.next(undefined))
    });
  }

  /**
   * 与其他异步处理方法的比较
   */

  /**
   * Promise写法一眼看上去代码完全都是Promise的API，操作本身的语义反而不容易看出来
   * @param {*} elem 
   * @param {*} animations 
   */
  function chainAnimationsPromise(elem, animations) {
    let ret = null

    let p = Promise.resolve()
    for (let anim of animations) {
      p = p.then(val => {
        ret = val
        return anim(elem)
      })
    }

    return p.catch(e => console.log(e)).then(() => ret)
  }

  /**
   * 使用Generator写法，自动执行器需要用户自己提供
   * @param {*} elem 
   * @param {*} animations 
   */
  function chainAnimationsGenerator(elem, animations) {
    return spawn(function* () {
      let ret = null

      try {
        for (let anim of animations) {
          ret = yield anim(elem)
        }
      } catch (e) {
        console.log(e)
      }

      return ret
    })
  }

  /**
   * 代码简洁，无语义不相关的代码
   * @param {*} elem 
   * @param {*} animations 
   */
  async function chainAnimationsAsync(elem, animations) {
    let ret = null

    try {
      for (let anim of animations) {
        ret = await anim(elem)
      }
    } catch (e) {
      console.log(e)
    }

    return ret
  }

  /**
   * 按顺序完成异步操作
   * 实际开发中，经常遇到一组异步操作，需要按照顺序完成
   * 继发和并发
   */
  function logInOrderPromise(urls) {
    const textPromises = urls.map(url => fetch(url).then(response => response.text()))

    textPromises.reduce((chain, textPromise) => {
      return chain.then(() => textPromise).then(text => console.log(text))
    }, Promise.resolve())
  }

  async function logInOrderAsync(urls) {
    for (const url of urls) {
      const response = await fetch(url)
      console.log(response.text())
    }
  }

  async function logInOrder(urls) {
    const textPromises = urls.map(async url => {
      const response = await fetch(url)
      return response.text()
    })

    for (const textPromise of textPromises) {
      console.log(await textPromise)
    }
  }

  /**
   * 顶层await
   * 根据语法规格，await命令只能出现在 async 函数内部，否则都会报错。
   * 目前，有一个语法提案，允许在模块的顶层独立使用await命令。
   * 这个提案的目的，是借用await解决模块异步加载的问题。
   */

   import {output} from './awaiting.js'

   function outputPlusValue(value) {
     return output + value
   }
   console.log(outputPlusValue(100))