

var socket = io.connect('/');

function conversationsUpdate(conversation) {

	/**
	 * TODO:MA:20120523 This is where we would add the latest conversation updates to the UI
	 */

	console.log("Recieved a new conversation", conversation);

}

socket.on('conversation update', function(object) {

	console.log('got new conversation', object);

	// Refresh the UI
	conversationsUpdate(object);
});
