/*
process.nextTick(function () {
  console.log('nextTick执行1');
});

process.nextTick(function () {
  console.log('nextTick执行2');
});

setImmediate(function () {
  console.log('setImmediate执行1');

  process.nextTick(function () {

    console.log('强势插入');
  });
});

setImmediate(function () {
  console.log('setImmediate执行2');
});

console.log('正常执行');

// 正常执行
// nextTick执行1
// nextTick执行2
// setImmediate执行1
// setImmediate执行2
// 强势插入
*/

/*
// 1
process.nextTick(function () {
  console.log("1");
});

// 2
process.nextTick(function () {
  console.log("2");

  // 3
  setImmediate(function () {
    console.log("3");
  });

  //4
  process.nextTick(function () {
    console.log("4");
  });
});

// 5
setImmediate(function () {
  console.log("5");
  
  // 6
  process.nextTick(function () {
    console.log("6");
  });

  //7
  setImmediate(function () {
    console.log("7");
  });
});

// 8
setTimeout(e => {
  console.log(8);
  
  // 9
  new Promise((resolve, reject) => {
    console.log(8 + "promise");
    resolve();
  }).then(e => {
    console.log(8 + "promise+then");
  })
}, 0)

// 10
setTimeout(e => {
  console.log(9);

  // 16
  setTimeout(e => {
    console.log(9 + 'setTimeout');
  }, 0);
}, 0)

// 11
setImmediate(function () {
  console.log("10");

  // 12
  process.nextTick(function () {
    console.log("11");
  });

  // 13
  process.nextTick(function () {
    console.log("12");
  });
  
  // 14
  setImmediate(function () {
    console.log("13");
  });
});

console.log("14");

// 15
new Promise((resolve, reject) => {
  console.log(15);
  resolve();
}).then(e => {
  console.log(16);
})

// 14, 15, 1, 2, 4, 16, 8, 8promise, 9, 8promise+then, 5, 10, 3, 6, 11, 12, 7, 13
*/
console.log('--------------------------------------------------');
/**
 * Node.js文档中称，setImmediate指定的回调函数，总是排在setTimeout前面。实际上，这种情况只发生在递归调用的时候。
 */
// 1
setImmediate(function A() {
  console.log(1);
  
  // 2
  setImmediate(function B() {
    console.log(2);
  })
});

// 3
setTimeout(function timeout() {
  console.log(3);
}, 0);

// 4
setImmediate(function () {
  // 5
  setImmediate(function A() {
    console.log(4);
    
    // 6
    setImmediate(function B() {
      console.log(5);
    })
  });

  // 7
  setTimeout(function timeout() {
    console.log(6);
  }, 0);
}, 0)

// 3, 1, 6, 2, 4, 5
// large probability: 3, 1, 2, 4, 6, 5

console.log('--------------------------------------')

let bar;

function someAsyncApiCall(callback) {
  callback();
}

someAsyncApiCall(() => {
  console.log('bar', bar); // bar undefined
});

bar = 1;