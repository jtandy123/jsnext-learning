const iterable = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
  [Symbol.iterator]: Array.prototype[Symbol.iterator],
};

// eslint-disable-next-line no-console
console.log([...iterable]);
