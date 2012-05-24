define([
	'jquery',
	'underscore',
	'/socket.io/socket.io.js'
], function($, _) {
	var

	Realtime = {},
	socket;


	function _onAppStart() {

		socket = io.connect('/');

		console.log('app started', socket);
	}



	$.subscribe('appstart', _onAppStart);


	return Realtime;
});
