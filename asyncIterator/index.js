function idMaker() {
  let index = 0;

  return {
    next() {
      return {
        value: new Promise((resolve) => setTimeout(() => { index += 1; resolve(index); }, 1000)),
        done: false,
      };
    },
  };
}

const it = idMaker();
it.next().value.then((o) => console.log(o));
it.next().value.then((o) => console.log(o));
it.next().value.then((o) => console.log(o));

/*
异步遍历器调用遍历器的next方法，返回的是一个 Promise 对象。
可以使用then方法指定，这个 Promise 对象的状态变为resolve以后的回调函数。
回调函数的参数，则是一个具有value和done两个属性的对象，这个跟同步遍历器是一样的。

一个对象的同步遍历器的接口，部署在Symbol.iterator属性上面。
对象的异步遍历器接口，部署在Symbol.asyncIterator属性上面。

异步遍历器的next方法，返回的是一个 Promise 对象。因此，可以把它放在await命令后面。next方法用await处理以后，就不必使用then方法了。
异步遍历器的next方法是可以连续调用的，不必等到上一步产生的 Promise 对象resolve以后再调用。这种情况下，next方法会累积起来，自动按照每一步的顺序运行下去。
*/

// for await...of 用于遍历异步的 Iterator 接口
// for...of循环自动调用对象的异步遍历器的next方法，会得到一个 Promise 对象。await用来处理这个 Promise 对象，一旦resolve，就把得到的值传入for...of的循环体
// 如果next方法返回的 Promise 对象被reject，for await...of就会报错，要用try...catch捕捉。
// 注意，for await...of循环也可以用于同步遍历器。
(async () => {
  for await (const x of ['a', 'b']) {
    console.log(x);
  }
})();

// 异步Generator函数 --- 返回一个异步遍历器对象
async function* gen() {
  yield 'hello';
}

const genObj = gen();
genObj.next().then((x) => console.log(x));
genObj.next().then((x) => console.log(x));

/*
// 异步遍历器的设计目的之一，就是 Generator 函数处理同步操作和异步操作时，能够使用同一套接口。
// 同步 Generator 函数
function* map(iterable, func) {
  const iter = iterable[Symbol.iterator]();
  while (true) {
    const { value, done } = iter.next();
    if (done) break;
    yield func(value);
  }
}

// 异步 Generator 函数
async function* map2(iterable, func) {
  const iter = iterable[Symbol.asyncIterator]();
  while (true) {
    const { value, done } = await iter.next();
    if (done) break;
    yield func(value);
  }
}
*/
/*
异步 Generator 函数内部，能够同时使用await和yield命令。
await命令用于将外部操作产生的值输入函数内部，yield命令用于将函数内部的值输出。
*/
const fetch = require('isomorphic-fetch');

function fetchRandom() {
  const url = 'https://www.random.org/decimal-fractions/' + '?num=1&dec=10&col=1&format=plain&rnd=new';
  return fetch(url);
}

async function* asyncGenerator() {
  console.log('Start');
  const result = await fetchRandom();
  yield 'Result: ' + await result.text();
  console.log('Done');
}

const ag = asyncGenerator();
ag.next().then(({value, done}) => {
  console.log(value);
});

/*
普通的async函数返回的是一个Promise对象，而异步Generator函数返回的是一个异步Iterator对象
async 函数和异步 Generator 函数，是封装异步操作的两种方法，都用来达到同一种目的。
区别在于，前者自带执行器，后者通过for await...of执行，或者自己编写执行器。

如果异步 Generator 函数抛出错误，会导致 Promise 对象的状态变为reject，然后抛出的错误被catch方法捕获。
*/

// async function* asyncGenerator() {
//   throw new Error('Problem!');
// }

// asyncGenerator().next().catch((err) => console.log(err));

async function takeAsync(asyncIterable, count = Infinity) {
  const result = [];
  const iterator = asyncIterable[Symbol.asyncIterator]();
  while (result.length < count) {
    const { value, done } = await iterator.next();
    if (done) break;
    result.push(value);
  }
  return result;
}

async function f() {
  async function* gen() {
    yield 'a';
    yield 'b';
    yield 'c';
  }

  return takeAsync(gen());
}

f().then((result) => {
  console.log(result);
});

/*
JavaScript 就有了四种函数形式：普通函数、async 函数、Generator 函数和异步 Generator 函数。
基本上，如果是一系列按照顺序执行的异步操作（比如读取文件，然后写入新内容，再存入硬盘），可以使用 async 函数；
如果是一系列产生相同数据结构的异步操作（比如一行一行读取文件），可以使用异步 Generator 函数。

异步 Generator 函数也可以通过next方法的参数，接收外部传入的数据。
*/
async function* createAsyncIterable(syncIterable) {
  for (const elem of syncIterable) {
    yield elem;
  }
}

const ca = createAsyncIterable(['x', 'y', 'z']);
ca.next().then((value) => console.log(value));
ca.next().then((value) => console.log(value));
ca.next().then((value) => console.log(value));
ca.next().then((value) => console.log(value));

/*
yield*语句也可以跟一个异步遍历器。
与同步 Generator 函数一样，for await...of循环会展开yield*。
yield*后面的 Generator 函数（没有return语句时），不过是for...of的一种简写形式，完全可以用后者替代前者。反之，在有return语句时，则需要用var value = yield* iterator的形式获取return语句的值。
*/
async function* gen1() {
  yield 'aaa';
  yield 'bbb';
  return 2;
}

async function* gen2() {
  // result 最终会等于 2
  const result = yield* gen1();
  console.log('result: ', result);
}

(async function () {
  for await (const x of gen2()) {
    console.log(x);
  }
})();