const socketIO = require('socket.io');
const io = socketIO(1234);
var d = new Date();
// client.js
const net = require('net');
var serverSocket=null;
let localIP;

io.on('connection', (socket) => {

  socket.on('io', (dt) => {

    if (dt.command == "connect") {
      console.log(dt.ip);
      localIP=dt.ip;

      serverSocket = net.createConnection({ port: 5002, host: localIP });
       serverSocket.on('connect', () => {
          serverSocket.write("ACK");
          socket.emit("message","connected");
          console.log("Connected to " + localIP);
       });
       serverSocket.on('error', function(ex) {
         socket.emit("message","connectionProblem");
       });
       serverSocket.on('data', function(data){
         socket.emit("message",data.toString());
       });

    }else if (dt.command == "disconnect") {
      disconnect();
      socket.emit("message","disconnected");
    }

    if (dt.command=="toggleOpen") {
      console.log(dt.line);
      socket.emit("message", "[Sended] :"+dt.line);
      serverSocket.write(dt.line);

    }else if(dt.command=="singleCommand"){
      console.log(dt.line);
      socket.emit("message", "[Sended] :"+dt.line);
      serverSocket.write(dt.line);
    }

  });

  socket.on('disconnect', () => {
    disconnect();
    socket.emit("message","disconnected");
  });
});

function disconnect(){
  console.log("Disconnected from " + localIP);
  if(serverSocket!=null)
    serverSocket.end();
}
