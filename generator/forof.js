function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

// eslint-disable-next-line no-console
console.log([...foo()]);
