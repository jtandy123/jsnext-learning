function* numbers() {
  yield 1;
  yield 2;
  return 3;
  yield 4;
}

for (const i of numbers()) {
  console.log(i);
}

console.log([...numbers()]);

const [x, y] = numbers();
console.log(x);
console.log(y);

console.log(Array.from(numbers()));