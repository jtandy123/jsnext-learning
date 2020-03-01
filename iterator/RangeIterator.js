class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    const { value } = this;
    if (value < this.stop) {
      this.value += 1;
      return {
        done: false,
        value,
      };
    }
    return {
      done: true,
      value: undefined,
    };
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

// eslint-disable-next-line no-console
console.log([...range(0, 3)]);
