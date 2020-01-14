/*
let output

(async () => {
    const dynamic = await import(someMission)
    const data = await fetch(url)
    output = someProcess(dynamic.default, data)
})()

export {output}
*/

// 目前的解决方法，就是让原始模块输出一个 Promise 对象，从这个 Promise 对象判断异步操作有没有结束。
/*
let output;
export default (async function main() {
  const dynamic = await import(someMission);
  const data = await fetch(url);
  output = someProcess(dynamic.default, data);
})();
export { output };
*/

const dynamic = import(someMission)
const data = fetch(url)
export const output = someProcess((await dynamic).default, await data)
/**
 * 上面代码中，两个异步操作在输出的时候，都加上了await命令。
 * 只有等到异步操作完成，这个模块才会输出值。
 * 
 * 模块的加载会等待依赖模块的异步操作完成，才执行后面的代码，有点像暂停在那里。
 * 所以，它总是会得到正确的output，不会因为加载时机的不同，而得到不一样的值。
 * 
 * 如果加载多个包含顶层await命令的模块，加载命令是同步执行的。
 * 顶层的await命令有点像，交出代码的执行权给其他的模块加载，等异步操作完成后，再拿回执行权，继续向下执行。
 */