function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    yield curr;
    [prev, curr] = [curr, prev + curr];
  }
}

// eslint-disable-next-line no-restricted-syntax
for (const n of fibonacci()) {
  if (n > 1000) break;
  // eslint-disable-next-line no-console
  console.log(n);
}
