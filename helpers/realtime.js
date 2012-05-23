var

SocketIO = require('socket.io'),
io;



exports.init = function(app) {

	io = SocketIO.listen(app);

console.log('init');
	io.sockets.on('connection', function (socket) {

		//console.log('connection', socket);



	});
};

/**
 * Broad a social update to the UI
 *
 * @param  {Object} object A social update object
 */
exports.broadcastSocial = function(object) {

	io.sockets.emit('social update', object);
};

/**
 * Broadcast an article update to the UI
 *
 * @param  {Object} object An article object
 */
exports.broadcastArticle = function(object) {

	io.sockets.emit('article update', object);
};