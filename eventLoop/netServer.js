const server = require('net').createServer();
server.on('connection', (conn) => {
  console.log('connenction: ', conn);
});

server.listen(8080);
server.on('listening', () => {
  console.log('listening 8080');
});