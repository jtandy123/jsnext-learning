function Node(value) {
  if (!new.target) {
    throw Error('call error');
  }
  this.value = value;
  this.next = null;
}

// eslint-disable-next-line func-names
Node.prototype[Symbol.iterator] = function () {
  let current = this;

  function next() {
    if (current) {
      const { value } = current;
      current = current.next;
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

  return { next };
};

const one = new Node(1);
const two = new Node(2);
const three = new Node(3);

one.next = two;
two.next = three;

// eslint-disable-next-line no-console
console.log([...one]);
