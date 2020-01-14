/*
ArrayBuffer对象、TypedArray视图和DataView视图是 JavaScript 操作二进制数据的一个接口。
它们都是以数组的语法处理二进制数据，所以统称为二进制数组。

二进制数组由三类对象组成。
（1）ArrayBuffer对象：代表内存之中的一段二进制数据，可以通过“视图”进行操作。“视图”部署了数组接口，这意味着，可以用数组的方法操作内存。
（2）TypedArray视图：共包括 9 种类型的视图，比如Uint8Array（无符号 8 位整数）数组视图, Int16Array（16 位整数）数组视图, Float32Array（32 位浮点数）数组视图等等。
（3）DataView视图：可以自定义复合格式的视图，比如第一个字节是 Uint8（无符号 8 位整数）、第二、三个字节是 Int16（16 位整数）、第四个字节开始是 Float32（32 位浮点数）等等，此外还可以自定义字节序。

ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。

TypedArray视图支持的数据类型一共有 9 种（DataView视图支持除Uint8C以外的其他 8 种）。
Int8Array
Uint8Array 8位不带符号整数
Uint8ClampedArray 8位不带符号整数（自动过滤溢出）
Int16Array
Uint16Array
Int32Array
Uint32Array
Float32Array
Float64Array

注意，二进制数组并不是真正的数组，而是类似数组的对象。

很多浏览器操作的 API，用到了二进制数组操作二进制数据：
- Canvas
- Fetch API
- File API
- WebSockets
- XMLHttpRequest
*/

/*
ArrayBuffer对象代表储存二进制数据的一段内存，它不能直接读写，只能通过视图（TypedArray视图和DataView视图)来读写，视图的作用是以指定格式解读二进制数据。
ArrayBuffer也是一个构造函数，可以分配一段可以存放数据的连续内存区域。
*/
const buf = new ArrayBuffer(32); // 生成了32字节的内存区域，每个字节的值默认都是0
const dataView = new DataView(buf); // 为了读写这段内容，需要为它指定视图。DataView视图的创建，需要提供ArrayBuffer对象实例作为参数。
console.log(dataView.getUint8(0));

// TypedArray视图，与DataView视图的一个区别是，它不是一个构造函数，而是一组构造函数，代表不同的数据格式。
// 分别建立两种视图：32 位带符号整数（Int32Array构造函数）和 8 位不带符号整数（Uint8Array构造函数）。由于两个视图对应的是同一段内存，一个视图修改底层内存，会影响到另一个视图。
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0] = 2;
console.log(x1[0]);

/*
TypedArray视图的构造函数，除了接受ArrayBuffer实例作为参数，还可以接受普通数组作为参数，直接分配内存生成底层的ArrayBuffer实例，并同时完成对这段内存的赋值。
*/
const typedArray = new Uint8Array([1, 2, 3]);
console.log(typedArray.length);

typedArray[0] = 5;
console.log(typedArray);

/*
ArrayBuffer.prototype.byteLength: ArrayBuffer实例的byteLength属性，返回所分配的内存区域的字节长度。
如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。
*/
console.log(buf.byteLength);

/*
ArrayBuffer.prototype.slice(): ArrayBuffer实例有一个slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。
slice方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去。
slice方法接受两个参数，第一个参数表示拷贝开始的字节序号（含该字节），第二个参数表示拷贝截止的字节序号（不含该字节）。如果省略第二个参数，则默认到原ArrayBuffer对象的结尾。
除了slice方法，ArrayBuffer对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。
*/
const newBuffer = buffer.slice(0, 8);
const xx = new Int32Array(newBuffer);
console.log(xx[0]);

// ArrayBuffer.isView(): ArrayBuffer有一个静态方法isView，返回一个布尔值，表示参数是否为ArrayBuffer的视图实例。
console.log(ArrayBuffer.isView(xx));


/*
ArrayBuffer对象作为内存区域，可以存放多种类型的数据。同一段内存，不同数据有不同的解读方式，这就叫做“视图”（view）。
ArrayBuffer有两种视图，一种是TypedArray视图，另一种是DataView视图。前者的数组成员都是同一个数据类型，后者的数组成员可以是不同的数据类型。

TypedArray视图一共包括 9 种类型，每一种视图都是一种构造函数。
这 9 个构造函数生成的数组，统称为TypedArray视图。它们都有length属性，都能用方括号运算符（[]）获取单个元素，所有数组的方法，在它们上面都能使用。

普通数组与 TypedArray 数组的差异主要在以下方面:
- TypedArray 数组的所有成员，都是同一种类型。
- TypedArray 数组的成员是连续的，不会有空位。
- TypedArray 数组成员的默认值为 0。比如，new Array(10)返回一个普通数组，里面没有任何成员，只是 10 个空位；new Uint8Array(10)返回一个 TypedArray 数组，里面 10 个成员都是 0。
- TypedArray 数组只是一层视图，本身不储存数据，它的数据都储存在底层的ArrayBuffer对象之中，要获取底层对象必须使用buffer属性。

（1）TypedArray(buffer, byteOffset=0, length?)
- 第一个参数（必需）：视图对应的底层ArrayBuffer对象。
- 第二个参数（可选）：视图开始的字节序号，默认从 0 开始。
- 第三个参数（可选）：视图包含的数据个数，默认直到本段内存区域结束。
注意，byteOffset必须与所要建立的数据类型一致，否则会报错。
如果想从任意字节开始解读ArrayBuffer对象，必须使用DataView视图，因为TypedArray视图只提供 9 种固定的解读格式。
*/
// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);

console.log('v1: ', v1);
console.log('v2: ', v2);
console.log('v3: ', v3);

/*
（2）TypedArray(length)
视图还可以不通过ArrayBuffer对象，直接分配内存而生成。
*/
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];
console.log(f64a);

/*
（3）TypedArray(typedArray)
TypedArray 数组的构造函数，可以接受另一个TypedArray实例作为参数。
此时生成的新数组，只是复制了参数数组的值，对应的底层内存是不一样的。新数组会开辟一段新的内存储存数据，不会在原数组的内存之上建立视图。
如果想基于同一段内存，构造不同的视图，可以采用下面的写法。
const x = new Int8Array([1, 1]);
const y = new Int8Array(x.buffer);
*/
const x = new Int8Array([1, 1]);
const y = new Int8Array(x);
x[0] = 2;
console.log(y[0]); // 1

/*
（4）TypedArray(arrayLikeObject)
构造函数的参数也可以是一个普通数组，然后直接生成TypedArray实例。
注意，这时TypedArray视图会重新开辟内存，不会在原数组的内存上建立视图。

TypedArray 数组也可以转换回普通数组:
const normalArray = [...typedArray];
// or
const normalArray = Array.from(typedArray);
// or
const normalArray = Array.prototype.slice.call(typedArray);
*/

// TypedArray 数组没有concat方法
function concatenate(ResultConstructor, ...arrays) {
  let totalLength = 0;
  arrays.forEach((arr) => {
    totalLength += arr.length;
  });
  const result = new ResultConstructor(totalLength);
  let offset = 0;

  arrays.forEach((arr) => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
}

const ui8a = concatenate(Uint8Array, Uint8Array.of(1, 2), Uint8Array.of(3, 4));
console.log(ui8a);

/*
TypedArray 数组与普通数组一样，部署了 Iterator 接口，所以可以被遍历。
*/
const ui8 = Uint8Array.of(0, 1, 2);
ui8.forEach((byte) => console.log(byte));

console.log('*'.repeat(50));

/*
字节序指的是数值在内存中的表示方式。
由于 x86 体系的计算机都采用小端字节序（little endian），相对重要的字节排在后面的内存地址，相对不重要字节排在前面的内存地址。

比如，一个占据四个字节的 16 进制数0x12345678，决定其大小的最重要的字节是“12”，最不重要的是“78”。
小端字节序将最不重要的字节排在前面，储存顺序就是78563412；大端字节序则完全相反，将最重要的字节排在前面，储存顺序就是12345678。
目前，所有个人电脑几乎都是小端字节序，所以 TypedArray 数组内部也采用小端字节序读写数据，或者更准确的说，按照本机操作系统设定的字节序读写数据。
事实上，很多网络设备和特定的操作系统采用的是大端字节序。
如果一段数据是大端字节序，TypedArray 数组将无法正确解析，因为它只能处理小端字节序！为了解决这个问题，JavaScript 引入DataView对象，可以设定字节序。
*/

const bu = new ArrayBuffer(16);
const int32View = new Int32Array(bu);

for (let i = 0; i < int32View.length; i += 1) {
  int32View[i] = i * 2; // 0 2 4 6
}

const int16View = new Int16Array(bu);

for (let i = 0; i < int16View.length; i += 1) {
  console.log(`Entry ${i}: ${int16View[i]}`);
}

console.log('@'.repeat(50));

const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');

function getPlatformEndianness() {
  const arr32 = Uint32Array.of(0x12345678);
  const arr8 = new Uint8Array(arr32.buffer);
  switch ((arr8[0] * 0x1000000) + (arr8[1] * 0x10000) + (arr8[2] * 0x100) + (arr8[3])) {
    case 0x12345678:
      return BIG_ENDIAN;
    case 0x78563412:
      return LITTLE_ENDIAN;
    default:
      throw new Error('Unknown endianness');
  }
}

console.log(LITTLE_ENDIAN === getPlatformEndianness());

// 与普通数组相比，TypedArray 数组的最大优点就是可以直接操作内存，不需要数据类型转换，所以速度快得多。

// 每一种视图的构造函数，都有一个BYTES_PER_ELEMENT属性，表示这种数据类型占据的字节数。
// 这个属性在TypedArray实例上也能获取，即有TypedArray.prototype.BYTES_PER_ELEMENT。
const ta = [Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array,
  Int32Array, Uint32Array, Float32Array, Float64Array];
ta.forEach((type) => {
  console.log(`${type.name}: ${type.BYTES_PER_ELEMENT}`);
});

/*
ArrayBuffer 与字符串的互相转换
ArrayBuffer 和字符串的相互转换，使用原生 TextEncoder 和 TextDecoder 方法。
*/

// Convert String to Uint8Array
function str2Uint8Array(input) {
  const encoder = new TextEncoder();
  const view = encoder.encode(input);
  return view;
}

// Convert ArrayBuffer/TypedArray to String via TextDecoder
function ab2str (input, outputEncoding) {
  const decoder = new TextDecoder(outputEncoding);
  return decoder.decode(input);
}

// Convert String to ArrayBuffer via TextEncoder
function str2ab (input) {
  const view = str2Uint8Array(input);
  return view.buffer;
}

// node.js还不支持TextDecoder和TextEncoder
// console.log(ab2str(int32View, 'utf-8'));

/*
TypedArray 数组的溢出处理规则，简单来说，就是抛弃溢出的位，然后按照视图类型进行解释。
一个简单转换规则，可以这样表示:
正向溢出（overflow）：当输入值大于当前数据类型的最大值，结果等于当前数据类型的最小值加上余值，再减去 1。
负向溢出（underflow）：当输入值小于当前数据类型的最小值，结果等于当前数据类型的最大值减去(余值的绝对值)，再加上 1。
余值是输入值与最大值或最小值的模值

Uint8ClampedArray视图的溢出规: 凡是发生正向溢出，该值一律等于当前数据类型的最大值，即 255；如果发生负向溢出，该值一律等于当前数据类型的最小值，即 0。
*/
const uint8c = new Uint8ClampedArray(1);
uint8c[0] = 256;
console.log(uint8c[0]); // 255
uint8c[0] = -1;
console.log(uint8c[0]); // 0

console.log('$'.repeat(50));

/*
TypedArray.prototype.buffer  返回整段内存区域对应的ArrayBuffer对象。只读属性。
TypedArray.prototype.byteLength  返回 TypedArray 数组占据的内存长度，单位为字节。只读属性。
TypedArray.prototype.byteOffset  返回 TypedArray 数组从底层ArrayBuffer对象的哪个字节开始。只读属性。
TypedArray.prototype.length  TypedArray 数组含有多少个成员。
TypedArray.prototype.set()  用于复制数组（普通数组或 TypedArray 数组），也就是将一段内容完全复制到另一段内存。整段内存的复制，比一个一个拷贝成员的复制快得多。
set方法还可以接受第二个参数，表示从b对象的哪一个成员开始复制a对象。

TypedArray.prototype.subarray()  对于 TypedArray 数组的一部分，再建立一个新的视图。
TypedArray.prototype.slice()  返回一个指定位置的新的TypedArray实例。
TypedArray.of()  将参数转为一个TypedArray实例。
TypedArray.from()  接受一个可遍历的数据结构（比如数组）作为参数，返回一个基于这个结构的TypedArray实例。还可以将一种TypedArray实例，转为另一种。
from方法还可以接受一个函数，作为第二个参数，用来对每个元素进行遍历，功能类似map方法。
*/
const a = new Uint16Array(8);
// const c = new Uint16Array(10);
// c.set(a, 2);

const c = a.subarray(2, 3);
console.log(c.byteLength); // 2

console.log(Uint8Array.of(0, 1, 2).slice(-1));

// 方法一
const tarr1 = new Uint8Array([1, 2, 3]);

// 方法二
const tarr2 = Uint8Array.of(1, 2, 3);

// 方法三
const tarr3 = new Uint8Array(3);
tarr3[0] = 1;
tarr3[1] = 2;
tarr3[2] = 3;

console.log(tarr1, tarr2, tarr3);

const ui16 = Uint16Array.from(Uint8Array.of(0, 1, 2));
console.log(ui16 instanceof Uint16Array); // true

Int8Array.of(127, 126, 125).map((z) => 2 * z);
// Int8Array [ -2, -4, -6 ]

Int16Array.from(Int8Array.of(127, 126, 125), (z) => 2 * z);
// Int16Array [ 254, 252, 250 ]
// from方法没有发生溢出，说明遍历不是针对原来的 8 位整数数组。
// from会将第一个参数指定的 TypedArray 数组，拷贝到另一段内存之中，处理之后再将结果转成指定的数组格式。

/*
由于视图的构造函数可以指定起始位置和长度，所以在同一段内存之中，可以依次存放不同类型的数据，这叫做“复合视图”。

struct someStruct {
  unsigned long id;
  char username[16];
  float amountDue;
};
*/
const bufferr = new ArrayBuffer(24);

const idView = new Uint32Array(bufferr, 0, 1);
const usernameView = new Uint8Array(bufferr, 4, 16);
const amountDueView = new Float32Array(bufferr, 20, 1);

console.log(idView, usernameView, amountDueView);

console.log('#'.repeat(50));

/*
如果一段数据包括多种类型（比如服务器传来的 HTTP 数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。
本来，在设计目的上，ArrayBuffer对象的各种TypedArray视图，是用来向网卡、声卡之类的本机设备传送数据，所以使用本机的字节序就可以了；
而DataView视图的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

DataView视图本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。
DataView(ArrayBuffer buffer [, 字节起始位置 [, 长度]]);
*/
const dvb = new ArrayBuffer(24);
const dv = new DataView(dvb);
console.log('data view: ', dv);

/*
DataView.prototype.buffer：返回对应的 ArrayBuffer 对象
DataView.prototype.byteLength：返回占据的内存字节长度
DataView.prototype.byteOffset：返回当前视图从对应的 ArrayBuffer 对象的哪个字节开始

DataView.prototype.getInt8()
DataView.prototype.getUint8()
DataView.prototype.getInt16()
DataView.prototype.getUint16()
DataView.prototype.getInt32()
DataView.prototype.getUint32()
DataView.prototype.getFloat32()
DataView.prototype.getFloat64()
这一系列get方法的参数都是一个字节序号（不能是负数，否则会报错），表示从哪个字节开始读取。
如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。
默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。

DataView.prototype.setInt8()
DataView.prototype.setUint8()
DataView.prototype.setInt16()
DataView.prototype.setUint16()
DataView.prototype.setInt32()
DataView.prototype.setUint32()
DataView.prototype.setFloat32()
DataView.prototype.setFloat64()
这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。
对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。
*/
const testBuffer = new ArrayBuffer(2);
const dvv = new DataView(testBuffer);
dvv.setInt16(0, 1);
console.log(new Int16Array(testBuffer)[0]); // 256

const littleEndian = (() => {
  const noname = new ArrayBuffer(2);
  new DataView(noname).setInt16(0, 256, true);
  return new Int16Array(noname)[0] === 256;
})();
console.log(littleEndian);
