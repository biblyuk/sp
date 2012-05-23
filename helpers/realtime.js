var

SocketIO = require('socket.io'),
io;



exports.init = function(app) {

	io = SocketIO.listen(app);

console.log('init');
	io.sockets.on('connection', function (socket) {

		console.log('connection', socket);

		

	});
};


exports.broadcast = function(message) {

	io.sockets.emit('stream update', {text: message});
};