function isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
}

function deepClone(obj) {
    if (typeof obj !== 'object' && typeof obj !== 'function') {
        return obj;
    }
    const o = Array.isArray(obj) ? [] : {};
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            o[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
        }
    }
    return o;
}

// 构造函数
function person(pname) {
    this.name = pname;
}

const Messi = new person('Messi');

// 函数
function say() {
    console.log('hi');
}

const oldObj = {
    a: say,
    b: new Array(1),
    c: new RegExp('ab+c', 'i'),
    d: Messi
};

const nObj = JSON.parse(JSON.stringify(oldObj));

// 无法复制函数
console.log(nObj.a, oldObj.a); // undefined [Function: say]
// 稀疏数组复制错误
console.log(nObj.b[0], oldObj.b[0]); // null undefined
// 无法复制正则对象
console.log(nObj.c, oldObj.c); // {} /ab+c/i
// 构造函数指向错误
console.log(nObj.d.constructor, oldObj.d.constructor); // [Function: Object] [Function: person]

const oObj = {};
oObj.a = oObj;
// const neObj = JSON.parse(JSON.stringify(oObj));
// console.log(neObj.a, oObj.a); // TypeError: Converting circular structure to JSON

console.log('------------------------------------------------------------');

const newObj = deepClone(oldObj);

console.log(newObj.a, oldObj.a); // [Function: say] [Function: say]
console.log(newObj.b[0], oldObj.b[0]); // undefined undefined
// 无法复制正则对象
console.log(newObj.c, oldObj.c); // {} /ab+c/i
// 构造函数指向错误
console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: Object] [Function: person]

console.log('-----------------------------------------------------------');

oldObj.e = oldObj;
const {clone} = require('./deepClone.js');
const obj = clone(oldObj);

console.log(obj.a, oldObj.a); // [Function: say] [Function: say]
console.log(obj.b[0], oldObj.b[0]); // undefined undefined
console.log(obj.c, oldObj.c); // /ab+c/i /ab+c/i
console.log(obj.d.constructor, oldObj.d.constructor); // [Function: person] [Function: person]
console.log(obj.e);
console.log(oldObj.e);
