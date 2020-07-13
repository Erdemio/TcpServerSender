const net = require('net');
const socketIO = require('socket.io');
const io = socketIO(1234);

let localIP=5002;

let c;

const connectedSockets = new Set();
connectedSockets.broadcast = function(data) {
    for (let sock of this)
        if (sock)
              sock.write(data.toString());
}


io.on('connection', (socket) => {

  socket.on('io', (dt) => {

    if (dt.command == "connect") {
      socket.emit("message","connected");
      console.log("Listening " + localIP);
      const server = net.createServer((c) => { connectedSockets.add(c); console.log('client connected');

      //clientlere gönder   connectedSockets.broadcast(mesaj, c);

        /*c.on('data', data => {
          console.log("[Received]: "+data.toString());
          connectedSockets.broadcast(data, c);
        });*/

          c.on('end', () => {  console.log('client disconnected');  connectedSockets.delete(c); });
      });

      server.on('error', (err) => { console.log("something went wrong."); });
      server.listen(5002, () => { console.log('Server mounted and loaded.'); });
    }else if (dt.command == "disconnect") {
      disconnect();
      socket.emit("message","disconnected");
    }

    if (dt.command=="toggleOpen") {
      console.log(dt.line);
      socket.emit("message", "[Sended] :"+dt.line);

      connectedSockets.broadcast(dt.line);

    }else if(dt.command=="singleCommand"){
      console.log(dt.line);
      socket.emit("message", "[Sended] :"+dt.line);
      connectedSockets.broadcast(dt.line);
    }

  });

  socket.on('disconnect', () => {  disconnect();  socket.emit("message","disconnected"); });

});

function disconnect(){
  console.log("Listening stop.");
}
