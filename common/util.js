const colors = require('colors');

const getStackTrace = function () {
  var obj = {};
  Error.captureStackTrace(obj, getStackTrace);
  return obj.stack;
};

exports.log = (...args) => {
  const stack = getStackTrace() || ""
  const matchResult = stack.match(/\(.*?\)/g) || [];
  let line = matchResult[1] || ""

  for (let i in args) {
    if (typeof args[i] == 'object') {
      args[i] = JSON.stringify(args[i])
    }
  }

  line = parseLine(line);

  args.push(line.red);
  console.log.apply(null, args);
};

const parseLine = (line) => {
  const parts = line.replace(/\)/g, '').split(':');
  return `${parts[parts.length - 2]}:${parts[parts.length - 1]}`;
}

/*
 * 获取顶层对象  
 */
(function (Object) {
  typeof globalThis !== 'object' && (
    this ?
      get() :
      (Object.defineProperty(Object.prototype, '_T_', {
        configurable: true,
        get: get
      }), _T_)
  );
  function get() {
    this.globalThis = this;
    delete Object.prototype._T_;
  }
}(Object));

var getGlobal = () => {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};

/*
 *  彻底冻结对象，除了将对象本身冻结，对象的属性也应该冻结
 */
const constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((key, i) => {
    if (typeof obj[key] === 'object') {
      constantize(obj[key]);
    }
  });
};

/*
 * 返回字符串长度，可以正确匹配码点大于0xFFFF的Unicode字符
 */
function codePointLength(text) {
  const result = text.match(/[\s\S]/gu);
  return result ? result.length : 0;
}

/*
 * 能够接受的最小误差范围
 * Number.EPSILON === 2**-52
 */
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2); // Math.pow(2, -50)
}

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};

Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || Number.isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};

Number.isSafeInteger = function (n) {
  return (typeof n === 'number' &&
    Math.round(n) === n &&
    Number.MIN_SAFE_INTEGER <= n &&
    n <= Number.MAX_SAFE_INTEGER);
}

// let message = SaferHTML`<p>${sender} has sent you a message.</p>`;
function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    // Escape special characters in the substitution.
    s += arg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Don't escape special characters in the template.
    s += templateData[i];
  }
  return s;
}

function is32Bit(c) {
  return c.codePointAt(0) > 0xFFFF;
}

Function.prototype.bind = function(that) {
  var target = this;
  var args = [].slice.call(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target.apply(this, [].concat.call(args, [].slice.call(arguments)));
      return result;
    } else {
      return target.apply(that, [].concat.call(args, [].slice.call(arguments)));
    }
  };

  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    [].push.call(boundArgs, '$' + i);
  }

  bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this, arguments); }')(binder);
  if (target.prototype) {
    function Empty() {}
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
}
