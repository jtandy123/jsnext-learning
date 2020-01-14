const http = require('http');

const server = http.createServer((req, res) => {
    const contentType = req.headers['content-type'];
    const buffers = [];
    req.on('data', chunk => buffers.push(chunk));
    req.on('end', () => {
        const content = Buffer.concat(buffers).toString();
        if (contentType === 'application/json') {
            console.log(JSON.parse(content).name);
        } else if (contentType === 'application/x-www-form-urlencoded') {
            const queryString = require('querystring');
            console.log(queryString.parse(content).age);
        }
        res.end('hello');
    });
});

server.listen(4000);
console.log("server started, listen to 4000");

