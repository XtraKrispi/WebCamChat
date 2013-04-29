var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io', { rememberTransport: false}).listen(server, {log: false});
var port = process.env.PORT || 3000;
app.use("/", express.static(__dirname + '/static'));
app.use("/static", express.static(__dirname + '/static'));

io.sockets.on('connection', function (socket) {
	console.log('connected');

  	socket.on('senddata', function(data){
  		socket.broadcast.emit('newdata', { id: socket.id, imageData: data.imageData, username: data.username});
  	});

  	socket.on('disconnect', function(){
  		console.log('disconnected');
  		socket.broadcast.emit('disconnect', { id: socket.id });
  	});
});

server.listen(port);
console.log('Server running on port ' + port);