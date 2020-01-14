// 加强了对Unicode的支持，扩展了String对象
let {log} = require('../common/util');

// 码点在\u0000 ~ \uFFFF之间
log('\u0061');

log('\u20BB7');

log('\u{20BB7}');

let hello = 123;
log(hell\u{6F}); // 123

log('\u{1F680}' === '\uD83D\uDE80'); // true

log('\u0000' == null); // false

log('\u597D'); // 好

// 当我们遇到两个字节，发现它的码点在U+D800到U+DBFF之间，就可以断定，紧跟在后面的两个字节的码点，应该在U+DC00到U+DFFF之间，这四个字节必须放在一起解读。
// H = Math.floor((c-0x10000) / 0x400) + 0xD800
// L = (c - 0x10000) % 0x400 + 0xDC00

log('\u{1D306}');

log('\u004F\u030C' === '\u01D1');

log('\u004F\u030C'.normalize());

log('\122');

log("\172".toString(8));
log("\172".toString(16));
log("\172".toString(2));
log("\122".toString(10));
log('--------------------------------------');
log(String.fromCharCode(122));
log(String.fromCodePoint(122));
log(String.fromCodePoint(0x2F804));
log('--------------------------------------');
const s = '𠮷a';
log(s.length); // 2
log(s.charAt(0)); // ''
log(s.charAt(1)); // ''
log(s.charAt(0) + s.charAt(1)); // 𠮷
log(s.charCodeAt(0)); // 55362
log(s.charCodeAt(1)); // 57271
log(s.codePointAt(0)); // 134071
log(s.codePointAt(1)); // 57271
for (let ch of s) {
    log(ch.codePointAt(0).toString(16));
}

function is32Bit(c) {
    return c.codePointAt(0) > 0xFFFF;
}
log(is32Bit('a'));

log(String.fromCodePoint(0x20BB7));

log(String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y');
log(String.fromCodePoint(0x78, 0x1f680, 0x79));

// log(s.at(0)); // 需要垫片

// normalize方法目前不能识别三个或三个以上字符的合成。这种情况下，还是只能使用正则表达式，通过 Unicode 编号区间判断

log('\u01D1'.normalize() === '\u004F\u030C'.normalize()); // true

log('\u004F\u030C'.normalize('NFC')); // Ǒ
log('\u004F\u030C'.normalize('NFD')); // Ǒ

{
    // 使用第二个参数n时，endsWith的行为与其他两个方法有所不同。它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。
    let s = 'Hello world!';
    s.startsWith('world', 6); // true
    s.endsWith('Hello', 5); // true
    s.includes('Hello', 6); // false
}

log('x'.repeat(3)); // "xxx"
log('hello'.repeat(2)); // "hellohello"
log('na'.repeat(0)); // ""
log('na'.repeat(2.9)); // "nana"

// repeat的参数是负数或者Infinity，会报错。
// 'na'.repeat(Infinity)
// RangeError
// 'na'.repeat(-1)
// RangeError

// 如果参数是 0 到-1 之间的小数，则等同于 0，这是因为会先进行取整运算。0 到-1 之间的小数，取整以后等于-0，repeat视同为 0
log('na'.repeat(-0.9)); // ""
// 参数NaN等同于 0
log('na'.repeat(NaN)); // ""
// 如果repeat的参数是字符串，则会先转换成数字。
log('na'.repeat('na')); // ""
log('na'.repeat('3')); // "nanana"

// padStart和padEnd一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。
log('x'.padStart(5, 'ab')); // 'ababx'
log('x'.padStart(4, 'ab')); // 'abax'

log('x'.padEnd(5, 'ab')); // 'xabab'
log('x'.padEnd(4, 'ab')); // 'xaba'

// 如果原字符串的长度， 等于或大于指定的最小长度， 则返回原字符串。
'xxx'.padStart(2, 'ab') // 'xxx'
'xxx'.padEnd(2, 'ab') // 'xxx'

// 如果用来补全的字符串与原字符串，两者的长度之和超过了指定的最小长度，则会截去超出位数的补全字符串。
'abc'.padStart(10, '0123456789')
// '0123456abc'

// 如果省略第二个参数，默认使用空格补全长度。
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '

// padStart的常见用途是为数值补全指定位数。
'1'.padStart(10, '0') // "0000000001"
'12'.padStart(10, '0') // "0000000012"
'123456'.padStart(10, '0') // "0000123456"
// 另一个用途是提示字符串格式。
'12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
'09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"

let sender = '<script>alert(`hehe`)</script>';
let message = SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
    let s = templateData[0];
    for (let i = 1; i < arguments.length; i++) {
        let arg = String(arguments[i]);

        // Escape special characters in the substitution.
        s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Don't escape special characters in the template.
        s += templateData[i];
    }
    return s;
}
log(`Safe string: ${message}`);
