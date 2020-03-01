const arr = [1, [[2, 3], 4], [5, 6]];

function* flat(a) {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of a) {
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

// eslint-disable-next-line no-console
console.log([...flat(arr)]);
