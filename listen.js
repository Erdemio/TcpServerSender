const net = require('net');
const socketIO = require('socket.io');
const io = socketIO(1234);

let localIP=5002;
let socketStatus="close";

let c;
let server;
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
      let server = net.createServer((c) => { connectedSockets.add(c); console.log('client connected');
          c.on('end', () => {  console.log('client disconnected');  connectedSockets.delete(c); });
          c.on('data', data => { socket.emit("message","[Received]: "+data.toString());});
          c.on('error', (err) => { console.log("something went wrong.");});
      });

      server.on('error', (err) => { console.log("something went wrong."); console.log(err); });

        if(socketStatus=="close"){
          server.listen(5002, () => { console.log('Server mounted and loaded.'); });
          socketStatus="open";
        }
    }else if (dt.command == "disconnect") {
      disconnect();
      socket.emit("message","disconnected");
      process.exit(22);
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

  socket.on('disconnect', () => { disconnect();  socket.emit("message","disconnected");});

});

function disconnect(){
  console.log("Listening stop.");
  //socketStatus="close";
}
