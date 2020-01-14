const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
for (let i of s) {
  console.log(i);
}

// Set函数可以接受一个数组（或者具有 iterable 接口的其他数据结构）作为参数，用来初始化。
// 去除数组的重复成员 [...new Set(array)]
const set = new Set([1, 2, 3, 4, 4]);
console.log([...set]); 

const items = new Set([1, 2, 3, 4, 5, 5, 5, 5]);
console.log(items.size); // 5

// 去除字符串里面的重复字符 [...new Set(string)].join('')
console.log([...new Set('ababbc')].join('')); // abc

// 向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。
let set1 = new Set(['5', 5]);
console.log('repeat: ', [...set1]);

// same-value-zero equality 向 Set 加入值时认为NaN等于自身，而精确相等运算符认为NaN不等于自身。
let set2 = new Set();
let a = NaN;
let b = NaN;
set2.add(a);
set2.add(b);
console.log(set2.size); // 1

// 两个对象总是不相等的
(function(){
  let set = new Set();
  set.add({});
  console.log('set size: ', set.size);

  set.add({});
  console.log('set size: ', set.size);
}());

/**
 * Set实例的属性：
 * Set.prototype.constructor
 * Set.prototype.size
 * 
 * Set实例的操作方法：
 * Set.prototype.add(value) 返回Set结构本身
 * Set.prototype.delete(value) 返回布尔值，表示删除是否成功
 * Set.prototype.has(value) 返回布尔值，表示Set实例是否包含该值
 * Set.prototype.clear() 无返回值
 * 
 * Set实例的遍历方法：
 * Set.prototype.keys() 返回键名的遍历器
 * Set.prototype.values() 返回键值的遍历器
 * Set.prototype.entries() 返回键值对的遍历器
 * Set.prototype.forEach() 使用回调函数遍历每个成员
 * 
 * Set的遍历顺序就是插入顺序
 */
(function(){
  // Array.from可以将Set结构转为数组
  const items = new Set([1, 2, 3, 4, 5]);
  console.log(Array.from(items)); // [1, 2, 3, 4, 5]

  function dedupe(array) {
    return Array.from(new Set(array));
  }
  console.log(dedupe([1, 1, 2, 3])); // [1, 2, 3]

  console.log('---------------------------------------')

  let set = new Set(['red', 'green', 'blue']);

  console.log('set.keys() === set.values(): ', set.keys() === set.values()); // false

  // red
  // green
  // blue
  for (let item of set.keys()) {
    console.log(item);
  }

  for (let item of set.values()) {
    console.log(item);
  }
  // ["red", "red"]
  // ["green", "green"]
  // ["blue", "blue"]
  for (let item of set.entries()) {
    console.log(item);
  }

  // Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法
  // 这意味着，可以省略values方法，直接用for...of循环遍历 Set
  console.log(Set.prototype[Symbol.iterator] === Set.prototype.values); // true
}());

(function() {
  let set = new Set([1, 4, 9]);
  set.forEach((value, key, s) => console.log(`${key} : ${value}`));
}());

(function() {
  // 扩展运算符（...）内部使用for...of循环，所以也可以用于Set结构
  let set = new Set(['red', 'green', 'blue']);
  let arr = [...set];
  console.log(arr); // ['red', 'green', 'blue']
}());

(function() {
  let a = new Set([1, 2, 3]);
  let b = new Set([4, 3, 2]);
  
  let union = new Set([...a, ...b]);
  console.log('union: ', union);
  
  let interset = new Set([...a].filter(x => b.has(x)));
  console.log('interset: ', interset);
  
  let difference = new Set([...a].filter(x => !b.has(x)));
  console.log('difference: ', difference);
}())

;(function() {
  // 如果想在遍历操作中，同步改变原来的 Set 结构，目前没有直接的方法
  // 一种是利用原 Set 结构映射出一个新的结构，然后赋值给原来的 Set 结构；另一种是利用Array.from方法
  let set = new Set([1, 2, 3]);
  set = new Set([...set].map(val => val * 2));
  console.log([...set]);

  set = new Set(Array.from(set, val => val * 2));
  console.log(...set);
}())

debugger;