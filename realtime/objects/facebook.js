/**
 * Poll Facebook users.
 *
 * @fileOverview
 * @author Matthew Caruana Galizia
 */

var

https       = require('https'),
events      = require('events'),
querystring = require('querystring'),
emtr        = new events.EventEmitter(),
apiKeys     = require('../../data/apikeys.json').facebook,
pollInterval,
users;

// The module is an EventEmitter
module.exports = emtr;

users = [
	"gettleman",
	"davidherszenhorn",
	"ethanklapper",
	"anjalimullany",
	"amzam",
	"jayrosen",
	"kristof",
	"amanda.michel",
	"azmatzahra",
	"JessicaVascellaro",
	"jebruner",
	"693300034",
	"jodikantor",
	"nxthompson",
	"dgelles",
	"josephmenn",
	"keirsimmons",
	"wolfgang.blau",
	"journotim",
	"1105068",
	"kevinrawlinson",
	"ChrisNuttall",
	"josh.halliday",
	"tomkeenebloomberg",
	"WaltMossberg",
	"lheron",
	"fieldproducer",
	"zseward",
	"amanpourabc",
	"SoledadOBrienCNN",
	"anncurry",
	"GeorgeStephanopoulos",
	"nickbilton",
	"fareedzakaria",
	"chris.cillizza",
	"DavidKirkpatrick",
	"davidcarrnyt",
	"LizGannes",
	"lpolgreen",
	"markmilian",
	"matt.wells.72",
	"coopnytimes",
	"cornstein",
	"yannis.koutsomitis",
	"AymanMohyeldin",
	"brianstelter",
	"mike.memoli",
	"peterkafka",
	"RebeccaJarvis",
	"rcarchibold",
	"DianeSawyer",
	"MattSeatonTheGuardian",
	"james.estrin"
];

/**
 * @private
 * @param {function} callback
 */
function getAccessToken(callback) {

	// curl -d "type=client_cred&client_id=241618399275675&client_secret=bd533291c6c5e4dcd14343af7eba64b6&scope=read_stream" https://graph.facebook.com/oauth/access_token
	var req = https.request({
			method:   'POST',
			hostname: 'graph.facebook.com',
			path:     '/oauth/access_token'
		},
		function(res) {
			var data = '';

			res.setEncoding('utf8');
			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				console.log("Facebook stream: got access token", data);

				callback(querystring.parse(data).access_token);
			});
		});

	console.log("Facebook stream: getting access from %s", req.path);

	req.setTimeout(10000, function() {
		console.log("Facebook stream: timed out while getting access token");
	});

	req.on('error', function(e) {
		console.error("Facebook stream: error getting access token", e);
	});

	req.write('type=client_cred&client_secret=' + apiKeys.app_secret + '&client_id=' + apiKeys.app_id + '&scope=read_stream', 'utf8');
	req.end();
}

function startPolling(accessToken) {
	var index = 0;

	clearInterval(pollInterval);

	// https://graph.facebook.com/me/feed?access_token=AAAAAAITEghMBAGz1KHZAKHZBQWZAVuZBZBllWWytUla4i2ZAzvv99SQNeU9w9vclJvmjR4BI1p017bQZCispi5EtuVxT9PsCZB7aTkrFfaZCt9gZDZD

	pollInterval = setInterval(function() {
			var req, user;

			if (index >= users.length) {
				index = 0;
			}

			user = users[index];

			req = https.request({
					method:   'GET',
					hostname: 'graph.facebook.com',
					path:     '/' + user + '/feed?access_token=' + accessToken
				},
				function(res) {
					var data = '';

					res.setEncoding('utf8');
					res.on('data', function(chunk) {
						data += chunk;
					});

					res.on('end', function() {
						try {
							data = JSON.parse(data).data;
						} catch (e) {
							console.log("Facebook stream: error parsing stream for user '%s'", user);
						}

						if (data && data.length) {
							console.log("Facebook stream: received %d posts for user %s", data.length, user);

							data.some(function(post) {
								var dateDiff = Date.now() - new Date(post.created_time).getTime();

								if (dateDiff > 86400000) { // Less than one day
									return true;
								}

								if (!post.message) {
									return false;
								}

								emtr.emit('post', {
									provider:  'facebook',
									id:        post.id,
									message:   post.message,
									timestamp: new Date(post.created_time).getTime(),
									user:      {
										realname: post.from.name,
										username: user,
										location: '',
										avatar:   'https://graph.facebook.com/' + user + '/picture'
									}
								});

								return false;
							});
						}
					});
				});

			req.on('error', function(e) {
				console.error("Facebook stream: error getting user feed", e);
			});

			console.log("Facebook stream: getting user stream for %s", req.path);

			req.setTimeout(900);
			req.end();

			index++;
		}, 1000);
}


/**
 * Start the output stream.
 *
 * @public
 */
function startStream() {
	getAccessToken(startPolling);
}

emtr.startStream = startStream;