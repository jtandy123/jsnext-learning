/*
多线程共享内存，最大的问题就是如何防止两个线程同时修改某个地址，或者说，当一个线程修改共享内存以后，必须有一个机制让其他线程同步。
SharedArrayBuffer API 提供Atomics对象，保证所有共享内存的操作都是“原子性”的，并且可以在所有线程内同步。

什么叫“原子性操作”呢？现代编程语言中，一条普通的命令被编译器处理以后，会变成多条机器指令。
如果是单线程运行，这是没有问题的；多线程环境并且共享内存时，就会出问题，因为这一组机器指令的运行期间，可能会插入其他线程的指令，从而导致运行结果出错。

Atomics对象可以保证一个操作所对应的多条机器指令，一定是作为一个整体运行的，中间不会被打断。
Atomics所涉及的操作都可以看作是原子性的单操作，这可以避免线程竞争，提高多线程共享内存时的操作安全。

Atomics对象提供多种方法。
（1）Atomics.store()，Atomics.load()
store()方法用来向共享内存写入数据，load()方法用来从共享内存读出数据。保证了读写操作的原子性。

2）Atomics.exchange()
Worker 线程如果要写入数据，可以使用Atomics.store()方法，也可以使用Atomics.exchange()方法。
它们的区别是，Atomics.store()返回写入的值，而Atomics.exchange()返回被替换的值。

（3）Atomics.wait()，Atomics.wake()
Atomics.wait(sharedArray, index, value, timeout)
- sharedArray：共享内存的视图数组。
- index：视图数据的位置（从0开始）。
- value：该位置的预期值。一旦实际值等于预期值，就进入休眠。
- timeout：整数，表示过了这个时间以后，就自动唤醒，单位毫秒。该参数可选，默认值是Infinity，即无限期的休眠，只有通过Atomics.wake()方法才能唤醒。
Atomics.wait()的返回值是一个字符串，共有三种可能的值。如果sharedArray[index]不等于value，就返回字符串not-equal，否则就进入休眠。
如果Atomics.wake()方法唤醒，就返回字符串ok；如果因为超时唤醒，就返回字符串timed-out。

Atomics.wake(sharedArray, index, count)
- sharedArray：共享内存的视图数组。
- index：视图数据的位置（从0开始）。
- count：需要唤醒的 Worker 线程的数量，默认为Infinity。
Atomics.wake()方法一旦唤醒休眠的 Worker 线程，就会让它继续往下运行。

注意，浏览器的主线程不宜设置休眠，这会导致用户失去响应。而且，主线程实际上会拒绝进入休眠。


Atomics.add(sharedArray, index, value)
Atomics.sub(sharedArray, index, value)
Atomics.and(sharedArray, index, value)
Atomics.or(sharedArray, index, value)
Atomics.xor(sharedArray, index, value)
上述方法都是返回旧的值，都是将value与sharedArray[index]进行运算，并将结果写入sharedArray[index]

Atomics.compareExchange(sharedArray, index, oldval, newval)：如果sharedArray[index]等于oldval，就写入newval，返回oldval。
Atomics.isLockFree(size)：返回一个布尔值，表示Atomics对象是否可以处理某个size的内存锁定。如果返回false，应用程序就需要自己来实现锁定。

Atomics.compareExchange的一个用途是，从 SharedArrayBuffer 读取一个值，然后对该值进行某个操作，操作结束以后，检查一下 SharedArrayBuffer 里面原来那个值是否发生变化（即被其他线程改写过）。
如果没有改写过，就将它写回原来的位置，否则读取新的值，再重头进行一次操作。
*/