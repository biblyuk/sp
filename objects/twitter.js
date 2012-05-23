var ntwitter = require('ntwitter');
var openCalais = require ('openCalais');

var twit = new ntwitter(keys);
var stream;
exports.startStream = function startStream() {
	console.log("start a stream from twitter");
    twit.stream('user', function(stream) {
      stream.on('data', function (tweet) {
        console.log(data);
        openCalais.send({
       		provider: 'twitter',
        	message: tweet.text,
        	timestamp: new Date(tweet.created_at).getTime(),
        	user: {
        		realname: tweet.user.name,
        		username: tweet.user.screen_name,
        	}
        })
      });
      stream.on('end', function (response) {
        console.log("Twitter stream disconnected")
      });
      stream.on('destroy', function (response) {
      	console.log("Twitter stream destroyed")
        // Handle a 'silent' disconnection from Twitter, no end/error event fired
      });
    });
}
exports.stopStream = function stopStream() {
	if (!stream) return;
	stream.destroy();
}

