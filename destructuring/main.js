const {log} = require('../common/util');

{
  let [a, b, c] = [1, 2, 3]
  log(a, b, c)

  let [foo, [[bar], baz]] = [1, [[2], 3]]
  log(foo, bar, baz)

  let [,, third] = ['foo', 'bar', 'baz']
  log(third)

  let [x,, y] = [1, , 3]
  log(x, y)
}

// let [f] = 1
// let [fo] = false
// let [fooo] = NaN
// let [foooo] = undefined
// let [fooooo] = null
// let [foooooo] = {}

{
  let [x, y, z] = new Set(['a', 'b', 'c'])
  log(x)
}

let [test = true] = []
log(test)

{
  let [x = 1] = [undefined]
}
{
  let [x = 1] = [null]
}

{
  function f () {
    console.log('aaa')
  }

  let [x = f()] = [1] // 表达式惰性求值
  log(x)
}

f()

{
  let [x = 1, y = x] = []
} // x=1; y=1
{
  let [x = 1, y = x] = [2]
} // x=2; y=2
{
  let [x = 1, y = x] = [1, 2]
} // x=1; y=2
// {let [x = y, y = 1] = [];} // ReferenceError

log('---------------------------------')

;((() => {
  let { foo, bar } = { foo: 'aaa', bar: 'bbb' }
  log(foo, bar)
})())

{
  let { baz } = { foo: 'aaa', bar: 'bbb' }
  log(baz)
}

{
  let { foo: baz} = { foo: 'aaa', bar: 'bbb' }
//   log(foo, baz) // ReferenceError: foo是匹配的模式，baz才是变量。真正被赋值的是变量baz, 而不是模式foo
}

{
  let obj = { first: 'hello', last: 'world' }
  let { first: f, last: l } = obj
  log(f, l)
}

{
  let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' }
  log(foo, bar)
}

{
  let obj = {
    p: [
      'Hell',
      { y: 'Worl' }
    ]
  }

  let { p, p: [x, { y }] } = obj
  log('p: ', p)
  log('x, y: ', x, y)
}

{
  const node = {
    loc: {
      start: {
        line: 1,
        column: 5
      }
    }
  }

  let { loc, loc: { start }, loc: { start: { line }} } = node
  log('line: ', line)
  log('loc: ', loc)
  log('start', start)
}

{
  //   let {foo: {bar}} = {baz: 'baz'} // TypeError: Cannot destructure property `bar` of `undefined` or `null`.
}

{
  let obj = {}
  let arr = []
  ;({ foo: obj.prop, bar: arr[0]} = { foo: 123, bar: true }); // 最外层圆括号必须加，否则JavaScript引擎会将=左侧的{}理解成一个代码块，从而发生语法错误
  log(obj)
  log(arr)
}

{
  let {log, sin, cos } = Math
  log('math')
  log = function () {
    console.log('test')
  }

  log()
}

{
  function test () {
    {
      foo()
      function foo () {
        log('foo test')
      }
    }
  }

  test()
}

{
  let arr = [1, 2, 3]
  let {0 : first, [arr.length - 1] : last} = arr
  log(first) // 1
  log(last) // 3
}

{
  const [a, b] = 'hello'
  log(a, b)
}

{
  let {toString: s1} = 123
  log(s1 === Number.prototype.toString) // true

  let {toString: s2} = true
  log(s2 === Boolean.prototype.toString) // true
}

log('---------------------------------')

{
  log([[1, 2], [3, 4]].map(([a, b]) => a + b))
}

log('---------------------------------')

{
  function move ({ x = 0, y = 0 } = {}) {
    log([x, y])
  }

  move({x: 3, y: 8}); // [3, 8]
  move({x: 3}); // [3, 0]
  move({}); // [0, 0]
  move(); // [0, 0]
}

{
  function move ({x, y} = { x: 0, y: 0 }) {
    log([x, y])
  }

  move({x: 3, y: 8}); // [3, 8]
  move({x: 3}); // [3, undefined]
  move({}); // [undefined, undefined]
  move(); // [0, 0]
}

log('---------------------------------')

/**
 * 3种解构赋值不得使用圆括号：变量声明语句；函数参数；赋值语句的模式
 */
{
  // 全部报错
  // let [(a)] = [1]

  // let {x: (c)} = {}
  // let ({x: c}) = {}
  // let {(x: c)} = {}
  // let {(x): c} = {}

  // let { o: ({ p: p }) } = { o: { p: 2 } }
}

{
  // 报错
  // function f([(z)]) { return z; }
  // 报错
  // function f([z,(x)]) { return x; }
  // 报错
  // function f(([z])) { return z; }
}

{
  // 全部报错
  // ({ p: a }) = { p: 42 }
  // ([a]) = [5]
  // 报错
  // [({ p: a }), { x: c }] = [{}, {}]
  // log(a, c)
}

/**
 * 可使用圆括号的情况只有一种：赋值语句的非模式部分，可以使用圆括号
 */
{
  [(b)] = [3]; // 正确
  ({ p: (d) } = {}); // 正确
  [(parseInt.prop)] = [3]; // 正确
}

/**
 * 1. 交换变量的值
 * 2. 从函数返回多个值
 * 3. 函数参数的定义
 * 4. 提取 JSON 数据
 * 5. 函数参数的默认值
 * 6. 遍历 Map 结构(for...of)
 * 7. 输入模块的指定方法
 */
{
  const map = new Map()
  map.set('first', 'hello')
  map.set('second', 'world')

  for (let [key, value] of map) {
    log(key + ' is ' + value)
  }
// first is hello
// second is world
}
