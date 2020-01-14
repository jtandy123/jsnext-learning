function* helloWorldGenerator() {
    yield 'hello'
    yield 'world'
    return 'ending'
}
// 调用Generator函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象，遍历器对象
// Generator函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行
var hw = helloWorldGenerator()
// next方法返回一个对象，value属性是当前yield表达式的值，done属性表示是否遍历结束
console.log(hw.next()) // { value: 'hello', done: false }
console.log(hw.next()) // { value: 'world', done: false }
console.log(hw.next()) // { value: 'ending', done: true }
console.log(hw.next()) // { value: undefined, done: true }
/**
 * 总结：
 * 调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。
 * 以后，每次调用遍历器对象的next方法，就会返回一个有着value和done两个属性的对象。
 * value属性表示当前的内部状态的值，是yield表达式后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束。
 * 
 * 遍历器对象的next方法的运行逻辑如下。
 *（1）遇到yield表达式，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
 *（2）下一次调用next方法时，再继续往下执行，直到遇到下一个yield表达式。
 *（3）如果没有再遇到新的yield表达式，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值。
 *（4）如果该函数没有return语句，则返回的对象的value属性值为undefined。
 * 
 * 正常函数只能返回一个值，因为只能执行一次return；Generator 函数可以返回一系列的值，因为可以有任意多个yield。
 * 从另一个角度看，也可以说 Generator 生成了一系列的值，这也就是它的名称的来历。
 * 
 * Generator 函数可以不用yield表达式，这时就变成了一个单纯的暂缓执行函数。
 * yield表达式只能用在 Generator 函数里面，用在其他地方都会报错。
 * 
 * 可以把 Generator 赋值给对象的Symbol.iterator属性，从而使得该对象具有 Iterator 接口。
 * Generator 函数执行后，返回一个遍历器对象。该对象本身也具有Symbol.iterator属性，执行后返回自身。
 */

function* gen() {

}
var g = gen()
console.log(g[Symbol.iterator]() === g) // true

/**
 * yield表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。
 * Generator 函数从暂停状态到恢复运行，它的上下文状态（context）是不变的。
 * 通过next方法的参数，就有办法在 Generator 函数开始运行之后，继续向函数体内部注入值。
 * 也就是说，可以在 Generator 函数运行的不同阶段，从外部向内部注入不同的值，从而调整函数行为。
 */
function* f() {
    for (var i = 0; i < 2; i++) {
        var reset = yield i
        if (reset) { i = -1 }
    }
}
var g = f()
console.log(g.next()) // { value: 0, done: false }
console.log(g.next()) // { value: 1, done: false }
console.log(g.next(true)) // { value: 0, done: false }
console.log(g.next()) // { value: 1, done: false }
console.log(g.next()) // { value: undefined, done: true }
console.log('---------------------')

function wrapper(generatorFunction) {
    return function (...args) {
        let generatorObject = generatorFunction(...args)
        generatorObject.next()
        return generatorObject
    }
}

const wrapped = wrapper(function* () {
    console.log(`First input: ${yield}`) // First input: hello!
    return 'DONE'
})

wrapped().next('hello!')

/**
 * for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
 */
function* foo() {
    yield 1
    yield 2
    yield 3
    yield 4
    yield 5
    return 6 // 一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象
}

for (let v of foo()) {
    console.log(v)
}

console.log('----------------------')

function* fibonacci() {
    let [prev, curr] = [0, 1]
    for (;;) {
        yield curr
        ;[prev, curr] = [curr, prev + curr] // ;不可省略，否则将变成 yield curr[prev, curr] = [curr, prev + curr]
    }
}

for (let n of fibonacci()) {
    if (n > 100) break
    console.log(n)
}

console.log('----------------------')

function* objectEntries() {
    console.log(Reflect.ownKeys(this))
    const propKeys = Object.keys(this)
    for (let propKey of propKeys) {
        yield [propKey, this[propKey]]
    }
}

var jane = {first: 'Jane', last: 'Doe'}
console.log(Reflect.ownKeys(jane))
/*
for (let [key, value] of objectEntries(jane)) {
    console.log(`${key}: ${value}`)
}
*/
jane[Symbol.iterator] = objectEntries

for (let [key, value] of jane) {
    console.log(`${key}: ${value}`)    
}

console.log('---------------------')

function* gen() {
    this.a = 1
    yield this.b = 2
    yield this.c = 3
}

function F() {
    return gen.call(gen.prototype)
}

var f = new F();

f.next()
f.next()
f.next()

console.log(f.a) // 1
console.log(f instanceof F) // false
console.log(f instanceof gen) // true

console.log('--------------')

/**
 * generator是实现状态机的最佳结构
 * generator本身包含一个状态信息，即目前是否处于暂停态
 */
var clock = function* () {
    while(true) {
        console.log('Tick')
        yield
        console.log('Tock')
        yield
    }
}

/**
 * Generator的含义：
 * - Generator与状态机
 * - Generator与协程
 * - Generator与上下文
 * 协程（coroutine）是一种程序运行的方式，可以理解成“协作的线程”或“协作的函数”。
 * 协程既可以用单线程实现，也可以用多线程实现。前者是一种特殊的子例程，后者是一种特殊的线程。
 * Generator 函数是 ES6 对协程的实现，但属于不完全实现。
 * Generator 函数被称为“半协程”（semi-coroutine），意思是只有 Generator 函数的调用者，才能将程序的执行权还给 Generator 函数。
 * 如果是完全执行的协程，任何函数都可以让暂停的协程继续执行。
 */

 /**
  * Generator的应用：
  * 1. 异步操作的同步化表达 - 用来处理异步操作，改写回调函数
  */
 /*
function* main() {
    var result = yield request('http://some.url')
    var resp = JSON.parse(result)
    console.log(resp.value)
}

function request(url) {
    makeAjaxCall(url, function(response) {
        it.next(response)
    })
}

var it = main()
it.next()
*/

/**
 * 2. 控制流管理
 */
/*
let steps = [step1Func, step2Func, step3Func]

function* iterateSteps(steps) {
    for (var i = 0; i < steps.length; i++) {
        var step = steps[i]
        yield step()
    }
}

let jobs = [job1, job2, job3]

function* iterateJobs(jobs) {
    for (var i = 0; i < jobs.length; i++) {
        var job = jobs[i]
        yield* iterateSteps(job.steps)
    }
}

for (var step of iterateJobs(jobs)){
  console.log(step.id);
}
*/

/**
 * 3. 部署Iterator接口
 */
function* makeSimpleGenerator(array) {
    var nextIndex = 0

    while(nextIndex < array.length) {
        yield array[nextIndex++]
    }
}

var gen = makeSimpleGenerator(['yo', 'ya'])

console.log(gen.next())
console.log(gen.next())
console.log(gen.next())

 /**
  * 4. 作为数据结构, 即可以看作是一个数组结构
  * Generator 函数可以返回一系列的值，这意味着它可以对任意表达式，提供类似数组的接口
  */
/*
function* doStuff() {
    yield fs.readFile.bind(null, 'hello.txt')
    yield fs.readFile.bind(null, 'world.txt')
    yield fs.readFile.bind(null, 'and-such.txt')
}

for (var task of doStuff()) {
    // code
}
*/


