/*
JavaScript 是单线程的，Web worker 引入了多线程：主线程用来与用户互动，Worker 线程用来承担计算任务。每个线程的数据都是隔离的，通过postMessage()通信。
*/

const sharedBuffer = new SharedArrayBuffer(1024);
// 主线程创建了一个Worker线程
const w = new Worker('myworker.js');

// 主线程通过w.postMessage向 Worker 线程发消息，同时通过message事件监听 Worker 线程的回应。
w.postMessage(sharedBuffer);
const sharedArray = new Int32Array(sharedBuffer);
sharedArray[0] = 1;
w.onmessage = (value) => {
  console.log(value);
};
console.log('data in main: ', sharedArray[1]);
setTimeout(() => console.log('data in main: ', sharedArray[1]), 20);

/*
worker_thread 模块中有 4 个对象和 2 个类。
- isMainThread: 是否是主线程，源码中是通过 threadId === 0 进行判断的。
- MessagePort: 用于线程之间的通信，继承自 EventEmitter。
- MessageChannel: 用于创建异步、双向通信的通道实例。
- threadId: 线程 ID。
- Worker: 用于在主线程中创建子线程。第一个参数为 filename，表示子线程执行的入口。
- parentPort: 在 worker 线程里是表示父进程的 MessagePort 类型的对象，在主线程里为 null
- workerData: 用于在主进程中向子进程传递数据（data 副本）


// const assert = require('assert');
const {
  Worker,
  MessageChannel,
  isMainThread,
} = require('worker_threads');
if (isMainThread) {
  const worker = new Worker('./sub.js');
  const subChannel = new MessageChannel();
  worker.postMessage({ hereIsYourPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
} else {
  // parentPort.once('message', (value) => {
  //   assert(value.hereIsYourPort instanceof MessagePort);
  //   value.hereIsYourPort.postMessage('the worker is sending this');
  //   value.hereIsYourPort.close();
  // });
}
*/
/*
ES2017 引入SharedArrayBuffer，允许 Worker 线程与主线程共享同一块内存。
SharedArrayBuffer的 API 与ArrayBuffer一模一样，唯一的区别是后者无法共享数据。

// 主线程

// 新建 1KB 共享内存
const sharedBuffer = new SharedArrayBuffer(1024);

// 主线程将共享内存的地址发送出去
w.postMessage(sharedBuffer);

// 在共享内存上建立视图，供写入数据
const sharedArray = new Int32Array(sharedBuffer);


// Worker 线程
onmessage = function (ev) {
  // 主线程共享的数据，就是 1KB 的共享内存
  const sharedBuffer = ev.data;

  // 在共享内存上建立视图，方便读写
  const sharedArray = new Int32Array(sharedBuffer);

  // ...
};

// 共享内存也可以在 Worker 线程创建，发给主线程。
*/
