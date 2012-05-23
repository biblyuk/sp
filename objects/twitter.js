var openCalais = require ('./opencalais.js');
var apiKeys = require('./apikeys.js');
var ntwitter = require('ntwitter');
var twit = new ntwitter(apiKeys.twitter);
var stream;
exports.startStream = function startStream() {
    twit.stream('user', function(stream) {
     stream.on('data', function (tweet) { 
       if (!tweet.text) return;
       try {
         openCalais.send({
         		provider: 'twitter',
          	message: tweet.text,
          	timestamp: new Date(tweet.created_at).getTime(),
          	user: {
          		realname: tweet.user.name,
          		username: tweet.user.screen_name,
              location: tweet.user.location,
              avatar: tweet.user.profile_image_url
          	}
          });
       } catch (e) {
        console.log("Error sending tweet to openCalais: ", e);
       }
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
