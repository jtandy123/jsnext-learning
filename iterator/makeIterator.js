// eslint-disable-next-line no-unused-vars
function makeIterator(array) {
  let nextIndex = 0;
  return {
    next() {
      return {
        // eslint-disable-next-line no-plusplus
        value: array[nextIndex++],
        done: nextIndex > array.length,
      };
    },
  };
}

// const iterator = makeIterator(['a', 'b']);
const iterator = ['a', 'b'][Symbol.iterator]();
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
