/**
 * Get tweets.
 *
 * @fileOverview
 * @author Luke Blaney
 */

var

events   = require('events'),
emtr     = new events.EventEmitter(),
apiKey   = require('../../data/apikeys.json').twitter,
ntwitter = require('ntwitter'),
twit     = new ntwitter(apiKey.access_token_key),
stream;

// The module is an EventEmitter
module.exports = emtr;


/**
 * Stop the Twitter stream.
 *
 * @private
 */
function stopStream() {
	if (!stream) {
		return;
	}

	stream.destroy();
	stream = null;
}


/**
 * Start the Twitter stream.
 *
 * @public
 */
function startStream() {
	twit.stream('user', function(s) {
		stream = s;

		stream.on('data', function(tweet) {

			if (!tweet.text) {
				return;
			}

			// Wrap in a try catch so any errors aren't fatal and we can get a decent error message
			try {
				emtr.emit('post', {
					provider:  'twitter',
					id:        tweet.id,
					message:   tweet.text,
					timestamp: new Date(tweet.created_at).getTime(),
					user:      {
						realname: tweet.user.name,
						username: tweet.user.screen_name,
						location: tweet.user.location,
						avatar:   tweet.user.profile_image_url
					}
				});
			} catch (e) {
				console.log("Error after getting tweet", e);
			}
		});

		stream.on('end', function (response) {
			console.error("Twitter stream disconnected");

			// Destroy the stream
			stopStream();
		});

		stream.on('destroy', function (response) {

			// Handle a 'silent' disconnection from Twitter, no end/error event fired
			console.log("Twitter stream destroyed");
		});

		stream.on('error', function (errortype, errorcode) {
			console.log("Twitter experienced a "+errortype+" error "+errorcode);
		})
	});
}

emtr.startStream = startStream;
