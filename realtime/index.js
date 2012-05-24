/**
 * The realtime server controller.
 *
 * @fileOverview
 * @author George Crawford
 * @author Matthew Caruana Galizia
 */

var

socketio   = require('socket.io'),

twitter    = require('./objects/twitter'),
facebook   = require('./objects/facebook'),
weibo      = require('./objects/weibo'),
opencalais = require('./objects/opencalais'),
ft         = require('./objects/ft'),

postCache  = [],
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

	console.log('Realtime server analysing:', postObject);

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

	// Send to OpenCalais for analysis
	opencalais.send(postObject);
}


/**
 * Collate a post that has been semantically analysed.
 *
 * @private
 * @param {Object} postObject The post object
 */
function collate(postObject) {
	var i, k, l, p, t, score, conversation;

	console.log('Realtime server collating:', postObject);

	for (i = 0, l = postCache.length; i < l; i++) {
		if (p === postObject) {
			continue;
		}

		p = postCache[i];
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


/**
 * Initialise the realtime server.
 *
 * @public
 * @param {Object} The main application controller
 */
function init(app) {
	io = socketio.listen(app);

	io.sockets.on('connection', function(socket) {
		console.log('Received a socket connection');
	});

	// When OpenCalais is done processing a post, pass it on for collation
	opencalais.on('processed', collate);

	twitter.on('post', analyse);
	twitter.startStream();

	facebook.on('post', analyse);
	facebook.startPolling();

	weibo.on('post', analyse);
	weibo.startStream();

	ft.on('processed', broadcast);
}

exports.init = init;
