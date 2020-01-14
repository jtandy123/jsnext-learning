/*
浏览器加载：
- 默认同步加载，阻塞页面加载
- 异步加载：
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
一句话，defer是“渲染完再执行”，async是“下载完就执行”。
另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。

浏览器加载 ES6 模块，也使用<script>标签，但是要加入type="module"属性。
<script type="module" src="./foo.js"></script>
浏览器对于带有type="module"的<script>，都是异步加载，不会造成堵塞浏览器，即等到整个页面渲染完，再执行模块脚本，等同于打开了<script>标签的defer属性。
如果网页有多个<script type="module">，它们会按照在页面出现的顺序依次执行。

<script>标签的async属性也可以打开，这时只要加载完成，渲染引擎就会中断渲染立即执行。执行完成后，再恢复渲染。
一旦使用了async属性，<script type="module">就不会按照在页面出现的顺序执行，而是只要该模块加载完成，就执行该模块。
async属性的优先级高于defer属性

ES6 模块也允许内嵌在网页中，语法行为与加载外部脚本完全一致。
<script type="module">
  import utils from "./utils.js";

  // other code
</script>

利用顶层的this等于undefined这个语法点，可以侦测当前代码是否在 ES6 模块之中。
const isNotModuleScript = this !== undefined;

ES6模块与CommonJS模块的差异：
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

ES6 模块的运行机制与 CommonJS 不一样。JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。
等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
换句话说，ES6 的import有点像 Unix 系统的“符号连接”，原始值变了，import加载的值也会跟着变。
因此，ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

ES6 模块和 CommonJS 采用各自的加载方案。
Node 要求 ES6 模块采用.mjs后缀文件名。也就是说，只要脚本文件里面使用import或者export命令，那么就必须采用.mjs后缀名。
require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

安装 Node v8.5.0 或以上版本，要用--experimental-modules参数才能打开该功能。
与浏览器的import加载规则相同，Node 的.mjs文件支持 URL 路径。
import './foo?query=1'; // 加载 ./foo 传入参数 ?query=1
Node 会按 URL 规则解读。同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存。由于这个原因，只要文件名中含有:、%、#、?等特殊字符，最好对这些字符进行转义。

目前，Node 的import命令只支持加载本地模块（file:协议），不支持加载远程模块。
如果模块名不含路径，那么import命令会去node_modules目录寻找这个模块。
import 'baz';
import 'abc/123';

如果模块名包含路径，那么import命令会按照路径去寻找这个名字的脚本文件。
import 'file:///etc/config/app.json';
import './foo';
import './foo?search';
import '../bar';
import '/baz';

如果脚本文件省略了后缀名，比如import './foo'，Node 会依次尝试四个后缀名：./foo.mjs、./foo.js、./foo.json、./foo.node。
如果这些脚本文件都不存在，Node 就会去加载./foo/package.json的main字段指定的脚本。
如果./foo/package.json不存在或者没有main字段，那么就会依次加载./foo/index.mjs、./foo/index.js、./foo/index.json、./foo/index.node。
如果以上四个文件还是都不存在，就会抛出错误。

Node 的import命令是异步加载，这一点与浏览器的处理方法相同。

ES6 模块应该是通用的，同一个模块不用修改，就可以用在浏览器环境和服务器环境。
为了达到这个目标，Node 规定 ES6 模块之中不能使用 CommonJS 模块的特有的一些内部变量。

首先，就是this关键字。ES6 模块之中，顶层的this指向undefined；CommonJS 模块的顶层this指向当前模块，这是两者的一个重大差异。
其次，以下这些顶层变量在 ES6 模块之中都是不存在的：
- arguments
- require
- module
- exports
- __filename
- __dirname

如果你一定要使用这些变量，有一个变通方法，就是写一个 CommonJS 模块输出这些变量，然后再用 ES6 模块加载这个 CommonJS 模块。
但是这样一来，该 ES6 模块就不能直接用于浏览器环境了，所以不推荐这样做。
// expose.js
module.exports = {__dirname};

// use.mjs
import expose from './expose.js';
const {__dirname} = expose;

es6模块加载CommonJS模块
CommonJS 模块的输出都定义在module.exports这个属性上面。Node 的import命令加载 CommonJS 模块，Node 会自动将module.exports属性，当作模块的默认输出，即等同于export default xxx。

一共有三种写法，可以拿到 CommonJS 模块的module.exports。

// 写法一
import baz from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法二
import {default as baz} from './a';
// baz = {foo: 'hello', bar: 'world'};

// 写法三
import * as baz from './a';
// baz = {
//   get default() {return module.exports;},
//   get foo() {return this.default.foo}.bind(baz),
//   get bar() {return this.default.bar}.bind(baz)
// }

CommonJS 模块的输出缓存机制，在 ES6 加载方式下依然有效。

由于 ES6 模块是编译时确定输出接口，CommonJS 模块是运行时确定输出接口，所以采用import命令加载 CommonJS 模块时，不允许采用下面的写法。
// 不正确
import { readFile } from 'fs';

CommonJS 模块加载 ES6 模块，不能使用require命令，而要使用import()函数。ES6 模块的所有输出接口，会成为输入对象的属性。

循环加载
两种模块格式CommonJS和ES6，处理循环加载的方法不一样，返回的结果也不一样

CommonJS模块的加载原理
CommonJS 的一个模块，就是一个脚本文件。require命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。
{
  id: '...',
  exports: { ... },
  loaded: true,
  ...
}
对象的id属性是模块名，exports属性是模块输出的各个接口，loaded属性是一个布尔值，表示该模块的脚本是否执行完毕。
以后需要用到这个模块的时候，就会到exports属性上面取值。即使再次执行require命令，也不会再次执行该模块，而是到缓存之中取值。
CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
CommonJS 输入的是被输出值的拷贝，不是引用。

CommonJS 模块遇到循环加载时，返回的是当前已经执行的部分的值，而不是代码全部执行后的值，两者可能会有差异。所以，输入变量的时候，必须非常小心。

ES6模块的循环加载
ES6 模块是动态引用，如果使用import从一个模块加载变量（即import foo from 'foo'），那些变量不会被缓存，而是成为一个指向被加载模块的引用

ES6模块的转码
Babel 
ES6 module transpiler是 square 公司开源的一个转码器，可以将 ES6 模块转为 CommonJS 模块或 AMD 模块的写法，从而在浏览器中使用。
$ npm install -g es6-module-transpiler
$ compile-modules convert file1.js file2.js
$ compile-modules convert -o out.js file1.js

SystemJS是一个垫片库（polyfill），可以在浏览器内加载 ES6 模块、AMD 模块和 CommonJS 模块，将其转为 ES5 格式。它在后台调用的是 Google 的 Traceur 转码器。
<script src="system.js"></script>
<script>
  System.import('./app.js');
</script>
System.import使用异步加载，返回一个 Promise 对象，所以可以用then方法指定回调函数。
*/