const net = require('net');

const connectedSockets = new Set();
connectedSockets.broadcast = function(data, except) {
    for (let sock of this)
        if (sock !== except)
              sock.write(data.toString());
}

const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  connectedSockets.add(c);
  c.on('end', () => {
    console.log('client disconnected');
    connectedSockets.delete(c);
  });

  c.on('data', data => {
    console.log("[Received]: "+data.toString());
    connectedSockets.broadcast(data, c);
  });
});
server.on('error', (err) => {
  throw err;
});
server.listen(5002, () => {
  console.log('Server mounted and loaded.');
});
