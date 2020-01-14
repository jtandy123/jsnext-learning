var mod = require('./lib');

console.log(mod.counter.value); // 3
mod.incCounter();
console.log(mod.counter.value); // 4
