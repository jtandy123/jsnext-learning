const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/',
    method: 'get',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 5
    }
};

const req = http.request(options, res => {
    res.on('data', chunk => console.log(chunk.toString()));
});

req.end('age=1');
req.end('2'); // 无效
