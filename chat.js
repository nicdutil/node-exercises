
/*
 * Exercise: create a small chat room
 */

var app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http);



	app.get('/', function(req,res) {
		res.sendfile('index.html');
	});

	io.on('connection', function(socket){

		io.emit('chat message', 'a user just joined the chat room');

		socket.on('disconnect', function() {
			console.log('user disconnected');
		});


		socket.on('chat message', function(msg) {
			console.log('message: ' + msg);
			io.emit('chat message', msg);
		});
	});


	http.listen(3000, '192.168.1.5', function() {
		console.log('listening on localhost:3000');
	});

