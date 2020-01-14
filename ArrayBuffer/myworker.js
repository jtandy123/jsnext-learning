// Worker线程
onmessage = (ev) => {
  console.log(ev.data);
  const sharedBuffer = ev.data;

  const sharedArray = new Int32Array(sharedBuffer);
  console.log('data in worker: ', sharedArray[0]);
  sharedArray[1] = 2;
};
/*
线程之间的数据交换可以是各种格式，不仅仅是字符串，也可以是二进制数据。
这种交换采用的是复制机制，即一个进程将需要分享的数据复制一份，通过postMessage方法交给另一个进程。
如果数据量比较大，这种通信的效率显然比较低。
*/
