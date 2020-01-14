/**
 * 为了解决只能用字符串当作对象的键的限制，ES6提供了Map数据结构。Map的键的范围不限于字符串，各种类型的值（包括对象）都可以当作键
 * Object结构提供了“字符串---值”的对应，Map结构提供了“值---值”的对应
 */
;(function() {
  const m = new Map();
  const o = {p: 'Hello World'};

  m.set(o, 'content');
  console.log(m.get(o)); // 'content'

  console.log(m.has(o)); // true
  m.delete(o);
  console.log(m.has(o)); // false
}())

/**
 * 作为构造函数，Map 也可以接受一个数组作为参数。该数组的成员是一个个表示键值对的数组。
 * 不仅仅是数组，任何具有 Iterator 接口、且每个成员都是一个双元素的数组的数据结构都可以当作Map构造函数的参数。
 * Set和Map都可以用来生成新的 Map。
 */
;(function() {
  const map = new Map([
    ['name', 'zhangshan'],
    ['title', 'Author']
  ]);

  console.log(map.size); // 2
  console.log(map.has('name')); // true
  console.log(map.get('name')); // zhangshan
  console.log(map.has('title')); // true
  console.log(map.get('title')); // Author

  console.log('-----------------------------------------');

  const set = new Set([['foo', 1], ['bar', 2]]);
  const m1 = new Map(set);
  console.log(m1.get('foo'));

  const m2 = new Map([['baz', 3]]);
  const m3 = new Map(m2);
  console.log(m3.get('baz'));
}())

console.log('-----------------------------------------');
/**
 * 如果对同一个键多次赋值，后面的值将覆盖前面的值。
 * 如果读取一个未知的键，则返回undefined。注意，只有对同一个对象的引用，Map 结构才将其视为同一个键。
 * Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。
 * 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。
 * 虽然NaN不严格相等于自身，但 Map 将其视为同一个键。
 */
;(function() {
  const map = new Map();

  map.set(-0, 123);
  console.log(map.get(+0)); // 123

  map.set(true, 1);
  map.set('true', 2);
  console.log(map.get(true)); // 1

  map.set(undefined, 3);;
  map.set(null, 4);
  console.log(map.get(undefined)); // 3

  map.set(NaN, 123);
  map.set(NaN, 456);
  console.log(map.get(NaN)); // 456
}())

console.log('---------------------------------------------')
/**
 * Map.prototype.size
 * Map.prototype.set(key, value), 可链式调用
 * Map.prototype.get(key)
 * Map.prototype.has(key)
 * Map.prototype.delete(key), true删除成功，false删除失败
 * Map.prototype.clear()
 * 
 * Map 结构原生提供三个遍历器生成函数和一个遍历方法。
 * Map.prototype.keys()
 * Map.prototype.values()
 * Map.prototype.entries()
 * Map.prototype.forEach()
 * 注：Map 的遍历顺序就是插入顺序
 */
 ;(function() {
   const map = new Map([
     ['F', 'no'],
     ['T', 'yes']
   ]);

   for (let key of map.keys()) {
     console.log(key);
   }

   for (let value of map.values()) {
     console.log(value);
   }

   for (let entry of map.entries()) {
     console.log(entry[0], entry[1]);
   }

   for (let [key, value] of map.entries()) {
     console.log(key, value);
   }

   for (let [key, value] of map) {
     console.log(key, value);
   }

   console.log(map[Symbol.iterator] === map.entries); // true
   console.log(Map.prototype[Symbol.iterator] === map.entries); // true
 }())

 console.log('-------------------------------------------');

 ;(function() {
   const map = new Map([
     [1, 'one'],
     [2, 'two'],
     [3, 'three']
   ]);

   console.log([...map.keys()]);
   console.log([...map.values()]);
   console.log([...map.entries()]);
   console.log([...map]);
   console.log(...map);
   console.log(map);
   // console.log([...({a: 1, b: 2, length: 0})]); // ...无法迭代类数组对象
 }())

console.log('---------------------------------------------');

;(function() {
  const map0 = new Map().set(1, 'a').set(2, 'b').set(3, 'c');

  const map1 = new Map([...map0].filter(([k, v]) => k < 3));
  console.log(...map1);

  const map2 = new Map([...map0].map(([k, v]) => [k * 2, '_' + v]));
  console.log(...map2);
}())

console.log('----------------------------------------------');

;(function() {
  const map = new Map().set(1, 'a').set(2, 'b').set(3, 'c');

  const reporter = {
    report: (key, value) => console.log('Key: %s, Value: %s', key, value)
  };

  map.forEach((value, key, map) => {
    // console.log(this);
    reporter.report(key, value);
  });
}())

console.log('-----------------------------------------------');

;(function() {
  // Map转为数组
  const myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
  console.log([...myMap]);

  // 数组转为Map
  new Map([
    [true, 7],
    [{foo: 3}, ['abc']]
  ]);

  // Map转为对象：键名会被转成字符串，再作为对象的键名
  function strMapToObj(strMap) {
    let obj = {};
    for (let [k, v] of strMap) {
      obj[k] = v;
    }
    return obj;
  }

  const m = new Map().set('yes', true).set('no', false).set({a: 1}, 1).set({b: 2}, 2);
  console.log(strMapToObj(m));

  // 对象转为Map
  function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
      strMap.set(k, obj[k]);
    }
    return strMap;
  }
  console.log(objToStrMap({yes: true, no: false, [Symbol()]: true}));

  // Map转为JSON
  // Map的键名都是字符串，可以转换为对象JSON
  function strMapToJson(strMap) {
    return JSON.stringify(strMapToObj(strMap));
  }

  let mm = new Map().set('yes', true).set('no', false);
  console.log(strMapToJson(mm));

  // Map的键名有非字符串，可以转为数组JSON
  function mapToArrayJson(map) {
    return JSON.stringify([...map]);
  }

  mm = new Map().set(true, 7).set({foo: 3}, ['abc']);
  console.log(mapToArrayJson(mm));

  // JSON转为Map
  function jsonToStrMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
  }
  console.log(jsonToStrMap('{"yes": true, "no": false}'));

  function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
  }

  console.log(jsonToMap('[[true, 7], [{"foo": 3}, ["abc"]]]'));
}())

// debugger;
