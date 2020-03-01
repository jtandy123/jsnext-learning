function* numbers() {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
}

const g = numbers();
console.log(g.next());
console.log(g.next());
console.log(g.return(7));
console.log(g.next());
console.log(g.next());
