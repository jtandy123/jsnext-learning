/*
setTimeout(function() {
    console.log('setTimeout');
});

process.nextTick(() => {
    console.log('next tick');
});

new Promise(function(resolve) {
    console.log('promise');
    resolve();
}).then(function() {
    console.log('then');
});

console.log('console');

// promise
// console
// next tick
// then
// setTimeout


console.log('1');

setTimeout(() => {
    console.log('2');

    process.nextTick(() => console.log('3'));

    new Promise((resolve) => {
        console.log('4');
        resolve();
    }).then(() => console.log('5'));
}, 200);

new Promise((resolve) => {
    console.log('7');
    resolve();
}).then(() => console.log('8'));

process.nextTick(() => console.log('6'));

setTimeout(() => {
    console.log('9');

    process.nextTick(() => console.log('10'));

    new Promise((resolve) => {
        console.log('11');
        resolve();
    }).then(() => console.log('12'));
}, 200);
*/
// browser
// 1
// 7
// 6
// 8

// 2
// 4
// 3
// 5

// 9
// 11
// 10
// 12

// node
// 1
// 7
// 6
// 8

// 2
// 4
// 9
// 11

// 3
// 10
// 5
// 12
/*
console.log('--------------------------------------');

const first = () => (new Promise((resovle,reject)=>{
    console.log(3);
    let p = new Promise((resovle, reject)=>{
        console.log(7);
        setTimeout(()=>{
            console.log(5);
            resovle(6);
        },0);
        resovle(1);
    });
    resovle(2);
    p.then((arg)=>{
        console.log(arg);
    });

}));

first().then((arg)=>{
    console.log(arg);
});
console.log(4);

// 3
// 7
// 4
// 1
// 2
// 5
*/
/*
console.log('----------------------------------');

process.nextTick(function A() {
    console.log(1);
    process.nextTick(function B(){console.log(2);});
});

setTimeout(function timeout() {
    console.log('TIMEOUT FIRED');
}, 0);

setImmediate(function () {
    console.log('set immediate');
});

console.log('--------------------------------');
*/
/*
setImmediate(function () {
    setTimeout(function () {
        console.log('1-');
    },0);

    setImmediate(function () {
        console.log('2-');
    })
});
*/
/*
console.log('--------------------------------');
process.nextTick(function () {
    console.log('nextTick执行1');
});

process.nextTick(function () {
    console.log('nextTick执行2');
});

setImmediate(function () {
    console.log('setImmediateჽ执行1');

    process.nextTick(function () {
        console.log('强势插入');
    });
});

setImmediate(function () {
    console.log('setImmediateჽ执行2');
});

console.log('正常执行');
console.log('----------------------------------');
*/

process.nextTick(function(){
    console.log("1");
});
process.nextTick(function(){
    console.log("2");
    setImmediate(function(){
        console.log("3");
    });
    process.nextTick(function(){
        console.log("4");
    });
});

setImmediate(function(){
    console.log("5");
    process.nextTick(function(){
        console.log("6");
    });
    setImmediate(function(){
        console.log("7");
    });
});
setTimeout(e=>{
    console.log(8);
    new Promise((resolve,reject)=>{
        console.log(8+"promise");
        resolve();
    }).then(e=>{
        console.log(8+"promise+then");
    })
},0)

setTimeout(e=>{ console.log(9); },0)

setImmediate(function(){
    console.log("10");
    process.nextTick(function(){
        console.log("11");
    });
    process.nextTick(function(){
        console.log("12");
    });
    setImmediate(function(){
        console.log("13");
    });
});
console.log("14");

new Promise((resolve,reject)=>{
    console.log(15);
    resolve();
}).then(e=>{
    console.log(16);
});
















