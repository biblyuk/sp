var

SocketIO = require('socket.io'),
io;



exports.init = function(app) {

	io = SocketIO.listen(app);

	io.sockets.on('connection', function (socket) {

		//console.log('connection', socket);
	});
};

/**
 * Broad a conversation update to the UI
 *
 * @param  {Object} object A conversation object
 */
exports.broadcastConversation = function(conversation) {

	io.sockets.emit('conversation update', conversation);
};
