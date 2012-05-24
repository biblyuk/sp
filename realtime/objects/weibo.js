/**
 * Get Weibo posts.
 *
 * @fileOverview
 * @author Matthew Andrews
 */

var

events = require('events'),
weibo  = require('weibo'),

secret = require('../../data/apikeys.json').weibo,

emtr   = new events.EventEmitter(),

appKey = 2669146070,

oauth_callback_url = 'http://localhost:5000/finalise',

tapi = weibo.tapi,

lastTweet = 0

;

tapi.init('weibo', appKey, secret.secret, oauth_callback_url);

// The module is an EventEmitter
module.exports = emtr;


// Not used anymore
function connect(req, res) {

	tapi.get_authorization_url({  }, function(error, data, xhr) {
		res.statusCode = 302;
		res.setHeader("Location", data);
		res.end();
	});
}

// Get token
function getToken(){
	tapi.get_access_token({'oauth_token_key': req.query.oauth_token, 'oauth_verifier' :req.query.oauth_verifier }, function(error, data, xhr) {
		var user = {};

		if (error) {
			console.log("An error");
			console.error(error);
		} else {

			user = {
				oauth_token_key: data.oauth_token_key,
				oauth_token_secret: data.oauth_token_secret,
				authtype: 'oauth'
			};

			tapi.verify_credentials(user, function(error, data, xhr) {
				if (error) {
					console.log("An error");
					console.error(error);
				} else {
					console.log(data);
				}
			});

		}
	});
}

function startStream(req, res) {

	var data = {
		user : {
			oauth_token_key: secret.oauth_token_key,
			oauth_token_secret: secret.oauth_token_secret,
			authtype: 'oauth'
		}
	};

	if (lastTweet > 0){
		data.since_id = lastTweet;
	}

	tapi.friends_timeline(data, function(error, data, xhr) {
		if (error) {
			console.log("An error");
			console.error(error);
		} else {

			// Recieved tweets
			if (data.length > 0) {
				console.log("Weibo: Received " + data.length + " tweets");
				lastTweet = data[0].id;
				for(var i, l = data.length; i < l; i++) {
					var tweet = data[i];
					emtr.emit('post', {
						provider:  'weibo',
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
				}

			}
		}
	});
	setTimeout(startStream, 10000);


}

emtr.startStream = startStream;