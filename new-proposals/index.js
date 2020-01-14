#!/usr/bin/env node
/*
1. do表达式
在块级作用域之前加上do，使它变为do表达式，然后就会返回内部最后执行的表达式的值。

let x = do {
  let t = f();
  t * t + 1;
};

let x = do {
  if (foo()) { f() }
  else if (bar()) { g() }
  else { h() }
};

do表达式在JSX语法中非常好用。之前只能用三元判断运算符（?:）。一旦判断逻辑复杂，代码就会变得很不易读


2. throw表达式
// 参数的默认值
function save(filename = throw new TypeError("Argument required")) {}

// 箭头函数的返回值
lint(ast, {
  with: () => throw new Error("avoid using 'with' statements.")
});

为了避免与throw命令混淆，规定throw出现在行首，一律解释为throw语句，而不是throw表达式。

3. 函数的部分执行（partial application）
多参数的函数有时需要绑定其中的一个或多个参数，然后返回一个新函数。现在有一个提案，使得绑定参数并返回一个新函数更加容易。
const add = (x, y) => x + y;
const addOne = add(1, ?);

const maxGreaterThanZero = Math.max(0, ...);
根据新提案，?是单个参数的占位符，...是多个参数的占位符。
?和...只能出现在函数的调用之中，并且会返回一个新函数。

const g = f(?, 1, ...);
// 等同于
const g = (x, ...y) => f(x, 1, ...y);

函数的部分执行，也可以用于对象的方法。
let obj = {
  f(x, y) { return x + y; },
};

const g = obj.f(?, 3);
g(1) // 4

注意：
（1）函数的部分执行是基于原函数的。如果原函数发生变化，部分执行生成的新函数也会立即反映这种变化。
let f = (x, y) => x + y;

const g = f(?, 3);
g(1); // 4

// 替换函数 f
f = (x, y) => x * y;

g(1); // 3

（2）如果预先提供的那个值是一个表达式，那么这个表达式并不会在定义时求值，而是在每次调用时求值。
let a = 3;
const f = (x, y) => x + y;

const g = f(?, a);
g(1); // 4

// 改变 a 的值
a = 10;
g(1); // 11

（3）如果新函数的参数多于占位符的数量，那么多余的参数将被忽略。
const f = (x, ...y) => [x, ...y];
const g = f(?, 1);
g(2, 3, 4); // [2, 1]

（4）...只会被采集一次，如果函数的部分执行使用了多个...，那么每个...的值都将相同。
const f = (...x) => x;
const g = f(..., 9, ...);
g(1, 2, 3); // [1, 2, 3, 9, 1, 2, 3]


4. 管道运算符
JavaScript 的管道是一个运算符，写作|>。它的左边是一个表达式，右边是一个函数。管道运算符把左边表达式的值，传入右边的函数进行求值。
x |> f
// 等同于
f(x)

管道运算符最大的好处，就是可以把嵌套的函数，写成从左到右的链式表达式。
// 传统的写法
exclaim(capitalize(doubleSay('hello')))
// "Hello, hello!"

// 管道的写法
'hello'
  |> doubleSay
  |> capitalize
  |> exclaim
// "Hello, hello!"

管道运算符只能传递一个值，这意味着它右边的函数必须是一个单参数函数。如果是多参数函数，就必须进行柯里化，改成单参数的版本。
function double (x) { return x + x; }
function add (x, y) { return x + y; }

let person = { score: 25 };
person.score
  |> double
  |> (_ => add(7, _))
// 57

管道运算符对于await函数也适用。
x |> await f
// 等同于
await f(x)

const userAge = userId |> await fetchUserById |> getAgeFromUser;
// 等同于
const userAge = getAgeFromUser(await fetchUserById(userId));


5. 数值分隔符
欧美语言中，较长的数值允许每三位添加一个分隔符（通常是一个逗号），增加数值的可读性。
有一个提案，允许 JavaScript 的数值使用下划线（_）作为分隔符。
let budget = 1_000_000_000_000;
budget === 10 ** 12 // true

JavaScript 的数值分隔符没有指定间隔的位数，也就是说，可以每三位添加一个分隔符，也可以每一位、每两位、每四位添加一个。
12345_00 === 123_4500 // true
12345_00 === 1_234_500 // true

小数和科学计数法也可以使用数值分隔符。
// 小数
0.000_001
// 科学计数法
1e10_000

数值分隔符有几个使用注意点:
- 不能在数值的最前面（leading）或最后面（trailing）。
- 不能两个或两个以上的分隔符连在一起。
- 小数点的前后不能有分隔符。
- 科学计数法里面，表示指数的e或E前后不能有分隔符。

除了十进制，其他进制的数值也可以使用分隔符。
// 二进制
0b1010_0001_1000_0101
// 十六进制
0xA0_B0_C0
注意，分隔符不能紧跟着进制的前缀0b、0B、0o、0O、0x、0X。

下面三个将字符串转成数值的函数，不支持数值分隔符。主要原因是提案的设计者认为，数值分隔符主要是为了编码时书写数值的方便，而不是为了处理外部输入的数据。
- Number()
- parseInt()
- parseFloat()
Number('123_456') // NaN
parseInt('123_456') // 123


6. BigInt数据类型
可以用在一个整数字面量后面加 n 的方式定义一个 BigInt ，如：10n，或者调用函数BigInt()。

JavaScript 原生提供BigInt对象，可以用作构造函数生成 BigInt 类型的数值。转换规则基本与Number()一致，将其他类型的值转为 BigInt。
BigInt()构造函数必须有参数，而且参数必须可以正常转为数值，下面的用法都会报错。
new BigInt() // TypeError
BigInt(undefined) //TypeError
BigInt(null) // TypeError
BigInt('123n') // SyntaxError
BigInt('abc') // SyntaxError
参数如果是小数，也会报错。

BigInt.prototype.toString()
BigInt.prototype.valueOf()
BigInt.prototype.toLocaleString()

BigInt.asUintN(width, BigInt) 给定的 BigInt 转为 0 到 (2^width) - 1 之间对应的值。
BigInt.asIntN(width, BigInt) 给定的 BigInt 转为 -2^(width - 1) 到 2^(width - 1) - 1 之间对应的值。
BigInt.parseInt(string[, radix]) 近似于Number.parseInt()，将一个字符串转换成指定进制的 BigInt。

如果BigInt.asIntN()和BigInt.asUintN()指定的位数，小于数值本身的位数，那么头部的位将被舍弃。

对于二进制数组，BigInt 新增了两个类型BigUint64Array和BigInt64Array，这两种数据类型返回的都是64位 BigInt。
DataView对象的实例方法DataView.prototype.getBigInt64()和DataView.prototype.getBigUint64()，返回的也是 BigInt。

转换规则
可以使用Boolean()、Number()和String()这三个方法，将 BigInt 可以转为布尔值、数值和字符串类型。

数学运算
不能和任何 Number 实例混合运算，两者必须转换成同一种类型。
以下操作符可以和 BigInt 一起使用： +、`*`、`-`、`**`、`%` 。
除 >>> （无符号右移）之外的 位操作 也可以支持。因为 BigInt 都是有符号的， >>> （无符号右移）不能用于 BigInt。
为了兼容 asm.js ，BigInt 不支持单目 (+) 运算符。
/ 操作符对于整数的运算也没问题。可是因为这些变量是 BigInt 而不是 BigDecimal ，该操作符结果会向零取整，也就是说不会返回小数部分。

其他运算
BigInt 对应的布尔值，与 Number 类型一致，即0n会转为false，其他值转为true。
比较运算符（比如>）和相等运算符（==）允许 BigInt 与其他类型的值混合计算，因为这样做不会损失精度。
BigInt 与字符串混合运算时，会先转为字符串，再进行运算。
*/

console.log(BigInt(123));
console.log(BigInt('123'));

const max = 2n ** (64n - 1n) - 1n;

console.log(BigInt.asIntN(64, max))
// 9223372036854775807n
console.log(BigInt.asIntN(64, max + 1n))
// -9223372036854775808n
console.log(BigInt.asUintN(64, max + 1n))
// 9223372036854775808n

console.log(String(1n))  // "1"
console.log(Number(0n) + 1 < 1); // false

/*
7. Math.signbit()
Math.sign()用来判断一个值的正负，但是如果参数是-0，它会返回-0。
目前，有一个提案，引入了Math.signbit()方法判断一个数的符号位是否设置了。
Math.signbit(2) //false
Math.signbit(-2) //true
Math.signbit(0) //false
Math.signbit(-0) //true
算法如下：
- 如果参数是NaN，返回false
- 如果参数是-0，返回true
- 如果参数是负值，返回true
- 其他情况返回false
*/
console.log(Math.sign(0)); // 0
console.log(Math.sign(-0)); // -0
console.log(Math.sign(2)); // 1
console.log(Math.sign(-3)); // -1

/*
8. 双冒号运算符
有一个提案，提出了“函数绑定”（function bind）运算符，用来取代call、apply、bind调用。
函数绑定运算符是并排的两个冒号（::），双冒号左边是一个对象，右边是一个函数。
该运算符会自动将左边的对象，作为上下文环境（即this对象），绑定到右边的函数上面。
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);

如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);

如果双冒号运算符的运算结果，还是一个对象，就可以采用链式写法。
import { map, takeWhile, forEach } from "iterlib";
getPlayers()
::map(x => x.character())
::takeWhile(x => x.strength > 100)
::forEach(x => console.log(x));

9. Realm API
以前，经常使用<iframe>作为沙箱。
const globalOne = window;
let iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const globalTwo = iframe.contentWindow;

Realm API 可以取代这个功能。
Realm API 提供一个Realm()构造函数，用来生成一个 Realm 对象。该对象的global属性指向一个新的顶层对象，这个顶层对象跟原始的顶层对象类似。
const globalOne = window;
const globalTwo = new Realm().global;

globalOne.evaluate('1 + 2') // 3
globalTwo.evaluate('1 + 2') // 3

Realm 沙箱里面只能运行 ECMAScript 语法提供的 API，不能运行宿主环境提供的 API。
Realm()构造函数可以接受一个参数对象，该参数对象的intrinsics属性可以指定 Realm 沙箱继承原始顶层对象的方法。
const r1 = new Realm();
r1.global === this;
r1.global.JSON === JSON; // false

const r2 = new Realm({ intrinsics: 'inherit' });
r2.global === this; // false
r2.global.JSON === JSON; // true

用户可以自己定义Realm的子类，用来定制自己的沙箱。
class FakeWindow extends Realm {
  init() {
    super.init();
    let global = this.global;

    global.document = new FakeDocument(...);
    global.alert = new Proxy(fakeAlert, { ... });
    // ...
  }
}

10. #!命令
这个命令放在脚本的第一行，用来指定脚本的执行器。
现在有一个提案，为 JavaScript 脚本引入了#!命令，写在脚本文件或者模块文件的第一行。
// 写在脚本文件第一行
#!/usr/bin/env node
'use strict';
console.log(1);

// 写在模块文件第一行
#!/usr/bin/env node
export {};
console.log(1);

有了这一行以后，Unix 命令行就可以直接执行脚本。
# 以前执行脚本的方式
$ node hello.js

# hashbang 的方式
$ hello.js
对于 JavaScript 引擎来说，会把#!理解成注释，忽略掉这一行。

11. import.meta
Node.js 提供了两个特殊变量__filename和__dirname，用来获取脚本的文件名和所在路径。
但是，浏览器没有这两个特殊变量。如果需要知道脚本的元信息，就只有手动提供。
<script data-option="value" src="library.js"></script>
使用data-属性放入元信息。如果脚本内部要获知元信息，可以像下面这样写。
const theOption = document.currentScript.dataset.option;
document.currentScript属性可以拿到当前脚本的 DOM 节点。

有一个提案，提出统一使用import.meta属性在脚本内部获取元信息。
这个属性返回一个对象，该对象的各种属性就是当前运行的脚本的元信息。
具体包含哪些属性，标准没有规定，由各个运行环境自行决定。

一般来说，浏览器的import.meta至少会有两个属性。
- import.meta.url：脚本的 URL。
- import.meta.scriptElement：加载脚本的那个<script>的 DOM 节点，用来替代document.currentScript。

<script type="module" src="path/to/hamster-displayer.js" data-size="500"></script>

(async () => {
  const response = await fetch(new URL("../hamsters.jpg", import.meta.url));
  const blob = await response.blob();

  const size = import.meta.scriptElement.dataset.size || 300;

  const image = new Image();
  image.src = URL.createObjectURL(blob);
  image.width = image.height = size;

  document.body.appendChild(image);
})();
*/