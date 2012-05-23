

var socket = io.connect('http://localhost:3000');

function streamUpdate() {

}

socket.on('stream update', function(from, msg) {

	// Refresh the UI
	console.log("Recieved a stream update from IO", from, msg);
	streamUpdate();

});