/**
 * co模块用于Generator函数的自动执行
 * Generator函数只要传入co函数，就会自动执行
 * co函数返回一个Promise对象，可以用then方法添加回调函数
 * 
 * Generator就是一个异步操作的容器。它的自动执行需要一种机制，当异步操作有了结果，能够自动交回执行权
 * （1）回调函数。将异步操作包装成 Thunk 函数，在回调函数里面交回执行权。
 * （2）Promise 对象。将异步操作包装成 Promise 对象，用then方法交回执行权。
 * 
 * 使用 co 的前提条件是，Generator 函数的yield命令后面，只能是 Thunk 函数或 Promise 对象。
 * 如果数组或对象的成员，全部都是 Promise 对象，也可以使用 co。
 */

 var fs = require('fs')
 var readFile = (fileName) => {
     return new Promise((resolve, reject) => {
         fs.readFile(fileName, (error, data) => {
             if (error) return reject(error)
             resolve(data)
         })
     })
 }

 var gen = function* () {
     var f1 = yield readFile('./async.js')
     var f2 = yield readFile('./index.js')
     console.log(f1.toString())
     console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
     console.log(f2.toString())
 }

 var g = gen()
 g.next().value.then((data) => {
     g.next(data).value.then((data) => {
         g.next(data);
     })
 })

 console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')

 function co(gen) {
     var ctx = this
     var args = Array.prototype.slice.call(arguments, 1)

     return new Promise((resolve, reject) => {
         // 先检查参数gen是否为 Generator 函数。如果是，就执行该函数，得到一个内部指针对象；如果不是就返回，并将 Promise 对象的状态改为resolved
         if (typeof gen === 'function') gen = gen.apply(ctx, args)
         if (!gen || typeof gen.next !== 'function') return resolve(gen)

         // 将Generator函数返回的迭代器对象的next方法包装成onFulfilled函数，主要为了能够捕捉抛出的错误
         onFulfilled()

         function onFulfilled(res) {
             var ret
             try {
                 ret = gen.next(res)
             } catch(e) {
                 return reject(e)
             }
             next(ret)
             return null
         }

         function onRejected(err) {
            var ret;
            try {
              ret = gen.throw(err);
            } catch (e) {
              return reject(e);
            }
            next(ret);
          }

         function next(ret) {
             if (ret.done) return resolve(ret.value)
             var value = toPromise.call(ctx, ret.value)
             if (value && isPromise(value)) return value.then(onFulfilled, onRejected)
             return onRejected(new TypeError(`You may only yield a function, promise, generator, array, or object, but the following object was passed: "${String(ret.value)}"`))
         }

     })
 }

 function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ('function' == typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
  }

  function thunkToPromise(fn) {
    var ctx = this;
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }

  function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this));
  }

  function objectToPromise(obj) {
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);
      else results[key] = obj[key];
    }
    return Promise.all(promises).then(function () {
      return results;
    });
  
    function defer(promise, key) {
      // predefine the key in the result
      results[key] = undefined;
      promises.push(promise.then(function (res) {
        results[key] = res;
      }));
    }
  }

  function isPromise(obj) {
    return 'function' == typeof obj.then;
  }

  function isGenerator(obj) {
    return 'function' == typeof obj.next && 'function' == typeof obj.throw;
  }

  function isGeneratorFunction(obj) {
    var constructor = obj.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
  }

  function isObject(val) {
    return Object == val.constructor;
  }