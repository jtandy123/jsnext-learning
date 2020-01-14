// [1, [2, 3], 4].flatMap(x => console.log(x)); // node不支持flat()和flatMap()
const {log} = console;
log(0 in [undefined, undefined, undefined]); // true
log(0 in [,,,]); // false

[, , 'a', ,'b'].forEach((item, i) => log(i));

const result = [1,,2].reduce((x, y, i) => {
  console.log(i); // 2
  return x+y;
});
log(result); // 3