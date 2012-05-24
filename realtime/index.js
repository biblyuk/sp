/**
 * The realtime server controller.
 *
 * @fileOverview
 * @author George Crawford
 * @author Matthew Caruana Galizia
 */

var

socketio = require('socket.io'),
twitter = require('./objects/twitter'),
facebook = require('./objects/facebook'),
weibo = require('./objects/weibo'),
opencalais = require('./objects/opencalais'),
ft = require('./objects/ft'),
postCache  = [],
translate = require('node-google-translate'),
assert = require('assert'),
googletranslatekey = require('../data/apikeys.json').googleapis,
io;


/**
 * Keep the post cache under control.
 *
 * @private
 */
function trimCache() {
	var maxLength = 1000, length = postCache.length;

	if (length > maxLength) {
		postCache.splice(maxLength - 1, length - maxLength);
		console.log("Trimmed %d elements from the post cache", length - maxLength);
	}
}


/**
 * Broadcast a conversation update to the UI.
 *
 * @private
 * @param {Object} conversation A conversation object
 */
function broadcast(conversation) {
	console.log('Realtime server broadcasting:', conversation);

	io.sockets.emit('conversation update', conversation);
}


/**
 * Route a post to OpenCalais for semantic analysis.
 *
 * @private
 * @param {Object} postObject The post object
 */
function analyse(postObject) {

	function _analyse(postObject) {
		// Don't do anything if the post is already known
		if (postCache.some(function(p) {
			return (p.id === postObject.id && p.provider === postObject.provider);
		})) {
			return;
		}

		// Keep track of posts from the first step
		postCache.push(postObject);
		trimCache();

		// TODO:MCG: Detect the language first using Google TR. If the language is en, es or fr, send to language-specific OpenCalais method. Otherwise perform a translation to English then send to OpenCalais.
		console.log('Realtime server analysing:', postObject.provider, postObject.id);

		// Send to OpenCalais for analysis
		opencalais.send(postObject);
	}

	// Translate ones string

	if (postObject.provider =='weibo') {
		try {
			translate({key: googletranslatekey, q: postObject.message, target: 'en', source: 'zh-CN'}, function(result){
				postObject.originalMessage = postObject.message;
				postObject.message = result[postObject.originalMessage];
				_analyse(postObject);
				
			});
		} catch(e){
			console.log(e);

		}
	} else {
		_analyse(postObject);
	}
}


/**
 * Collate a post that has been semantically analysed.
 *
 * @private
 * @param {Object} postObject The post object
 */
function collate(postObject) {
	var i, k, l, p, t, score, conversation;

	console.log('Realtime server collating:', postObject.provider, postObject.id);

	for (i = 0, l = postCache.length; i < l; i++) {
		p = postCache[i];

		if (p === postObject || !p.tags) {
			continue;
		}

		t = {};
		score = 0;

		// Check for matches
		for (k in postObject.tags) {
			score--;

			if (postObject.tags.hasOwnProperty(k)) {
				if (p.tags.hasOwnProperty(k)) {
					score++;

					t[k] = p.tags[k];
				}
			}
		}

		if (t.score <= 0) {
			continue;
		}

		if (!conversation) {
			conversation = {
				messages: [postObject, p],
				tags:     t
			};
		} else {
			conversation.messages.push(p);

			for (k in t) {
				if (t.hasOwnProperty(k) && !conversation.tags.hasOwnProperty(k)) {
					conversation.tags[k] = t;
				}
			}
		}
	}

	if (conversation) {
		ft.search(conversation);
	}
}


function _onSocketConnection() {
	console.log('Received a socket connection');
}


/**
 * Initialise the realtime server.
 *
 * @public
 * @param {Object} The main application controller
 */
exports.init = function(app) {
	io = exports.io = socketio.listen(app);

	// Turn debug logs down
	io.set('log level', 1);

	//
	io.sockets.on('connection', _onSocketConnection);

	// When OpenCalais is done processing a post, pass it on for collation
	opencalais.on('processed', collate);

	twitter.on('post', analyse);
	twitter.startStream();

	facebook.on('post', analyse);
	facebook.startStream();

	weibo.on('post', analyse);
	weibo.startStream();

	ft.on('processed', broadcast);
};