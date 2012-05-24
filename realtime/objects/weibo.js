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
emtr   = new events.EventEmitter();

// The module is an EventEmitter
module.exports = emtr;

function startStream() {
	var

	tapi = weibo.tapi,
	appKey = 2669146070,
	oauth_callback_url = 'http://localhost:3000/testingweibo' || 'oob';

	tapi.init('tsina', appKey, secret.secret, oauth_callback_url);

	tapi.friends({}, function(error, data, xhr) {
	    if (error) {
	        console.error(error);
	    } else {
	        console.log(data);

	        // Call emtr.emit('post', postObject); for every single post
	    }
	});
}

emtr.startStream = startStream;