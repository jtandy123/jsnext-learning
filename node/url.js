let url = require('url');
let u = 'http://www.baidu.com:80/abc/index.html?a=1&b=2#hash&test';
/**
 * @param url
 * @param parseQueryString 是否将query string解析成object
 */
let urlObj = url.parse(u, false);
console.log(urlObj.host);
console.log(urlObj.hostname);
console.log(urlObj.port);
console.log(urlObj.pathname);
console.log(urlObj.query);
console.log(urlObj.query.a);
console.log(urlObj.query.b);
console.log(urlObj.hash);
