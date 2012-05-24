define([
	'jquery',
	'underscore',
	'/socket.io/socket.io.js'
], function($, _) {
	var

	Realtime = {},
	socket;


	function _onNewConversation(data) {
		$.publish('newConversation', data);
	}

	function _onUpdateConversation(data) {
		$.publish('updateConversation', data);
	}

	/**
	 * Connects to the socket, then sets up the socket
	 * listeners.
	 *
	 * @private
	 */

	function _onAppStart() {
		socket = io.connect('/');
		socket.on('newConversation', _onNewConversation);
		socket.on('updateConversation', _onUpdateConversation);
	}

	// Events
	$.subscribe('appStart', _onAppStart);

	// Return public
	return Realtime;
});
