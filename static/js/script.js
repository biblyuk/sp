

var socket = io.connect('http://localhost:3000');

function streamUpdate(object) {

	/**
	 * TODO:MA:20120523 This is where we would add the latest social updates to the UI
	 */
	
}

function articleUpdate(object) {

	/**
	 * TODO:MA:20120523 This is where we would add the latest article updates to the UI
	 */

}

socket.on('social update', function(object) {

	// Refresh the UI
	console.log("Recieved a stream update from IO", object);
	streamUpdate(msg);

});

socket.on('article update', function(object) {

	// Refresh the UI
	console.log("Recieved an article update from IO", object);
	articleUpdate();
});