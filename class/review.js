function Point() {}

Point.prototype.constructor = function (x, y) {
  this.x = x;
  this.y = y;
};

console.log(Point);
console.log('point constructor: ', Point.prototype.constructor);
const point = new Point(1, 2);
console.log(point);

const point2 = new Point.prototype.constructor(3, 4);
console.log(point2);
