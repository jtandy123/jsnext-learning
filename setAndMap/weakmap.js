/**
 * WeakMap与Map区别：
 * 首先，WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名。
 * 其次，WeakMap的键名所指向的对象，不计入垃圾回收机制。
 * WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。
 * WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。
 * 因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。
 * 也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
 * 
 * 基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。
 * 一个典型应用场景是，在网页的 DOM 元素上添加数据，就可以使用WeakMap结构。当该 DOM 元素被清除，其所对应的WeakMap记录就会自动被移除。
 * 
 * 注意，WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用。
 */

 // 键值obj是正常引用。所以，即使在 WeakMap 外部消除了obj的引用，WeakMap 内部的引用依然存在
 const wm = new WeakMap();
 let key = {};
 let obj = {foo: 1};

 wm.set(key, obj);
 obj = null;
 console.log(wm.get(key));

 /**
  * WeakMap只用四个方法可用：get()、set()、has()、delete()
  * 
  * $ node --expose-gc
  * --expose-gc参数表示允许手动执行垃圾回收机制
  * > global.gc()
  * > process.memoryUsage()
  * 
  */
 global.gc();
 console.log(process.memoryUsage()); // Object {rss: 26402816, heapTotal: 11780096, heapUsed: 4271272, external: 8272}
 let weakMap = new WeakMap();
 let k = new Array(5 * 1024 * 1024);
 weakMap.set(k, 1);
 global.gc();
 console.log(process.memoryUsage()); // Object {rss: 68796416, heapTotal: 54259712, heapUsed: 46459736, external: 8272}
 k = null;
 global.gc();
 console.log(process.memoryUsage()); // Object {rss: 68820992, heapTotal: 12304384, heapUsed: 4517912, external: 8272}

 // 属性counter和action不是私有属性
 class Countdown {
   constructor(counter, action) {
     this.counter = counter;
     this.action = action;
   }

   dec() {
     if (this.counter < 1) return;
     this.counter--;
     if (this.counter === 0) {
       this.action();
     } 
   }
 }

 const c = new Countdown(2, () => console.log('DONE'));
 c.dec();
 c.dec();

 console.log('------------------------------------------------')

 /**
  * WeakMap 应用的典型场合就是 DOM 节点作为键名
  * WeakMap的另一个用处是部署私有属性 
  */
 const _counter = new WeakMap();
 const _action = new WeakMap();

 class CountDown {
   constructor(counter, action) {
     _counter.set(this, counter);
     _action.set(this, action);
   }

   dec() {
     let counter = _counter.get(this);
     if (counter < 1) return;
     counter--;
     _counter.set(this, counter);
     if (counter === 0) {
       _action.get(this)();
     }
   }
 }

 const cd = new CountDown(2, () => console.log('DONE'));
 const cd2 = new CountDown(2, () => console.log('Done'));
 cd.dec();
 cd2.dec();
 cd.dec();
 cd2.dec();
 console.log(_counter.get(cd));

 console.log('--------------------------------------------');
 const CountDown1 = require('./CountDown');
 const codo = new CountDown1(2, () => console.log('DONE'));
 codo.dec();
 const codo2 = new CountDown1(3, () => console.log('DONE2'));
 codo.dec();
 codo2.dec();
 codo2.dec();
//  codo2.dec();

const CountDown2 = require('./CountDown');

console.log('CountDown1 === CountDown2: ', CountDown1 === CountDown2);