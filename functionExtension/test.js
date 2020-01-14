var handler = {
  id: '123456',
  init() {
    setTimeout(() => {
      this.doSomething();
    });  
  },
  doSomething() {
    console.log('do something');
  }
};

handler.init();

var init = handler.init;
// init(); // TypeError: this.doSomething is not a function.