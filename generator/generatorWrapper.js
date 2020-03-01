function wrapper(generatorFunction) {
  return (...args) => {
    const generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

// eslint-disable-next-line func-names
const wrapped = wrapper(function* () {
  // eslint-disable-next-line no-console
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello');
