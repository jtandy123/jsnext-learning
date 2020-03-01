const obj = {
  data: ['a', 'b', 'c'],
  [Symbol.iterator]() {
    const self = this;
    let index = 0;
    return {
      next() {
        if (index < self.data.length) {
          return {
            done: false,
            // eslint-disable-next-line no-plusplus
            value: self.data[index++],
          };
        }
        return {
          done: true,
          value: undefined,
        };
      },
    };
  },
};

// eslint-disable-next-line no-console
console.log([...obj]);

const object = {
  a: 1,
  b: 2,
  c: 3,
};

function* entries(o) {
  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(o)) {
    yield [key, o[key]];
  }
}

// eslint-disable-next-line no-console
console.log([...entries(object)]);
