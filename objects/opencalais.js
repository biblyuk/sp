/**
 * Pass data from Facebook, Twitter, etc. to OpenCalais for analysis, before routing to the grouping step.
 *
 * @fileOverview
 * @author Matthew Caruana Galizia
 */

var 

http = require('http'),

apiKey = require('./apikeys').opencalais,
queue = new require('./base/list');

function consume() {
	var last = queue.last;

	// Don't do anything if there's nothing in the queue
	if (!last) {
		return;
	}

	http.request({
			host: 'api.opencalais.com',
			path: '/tag/rs/enrich',
			headers: {
				'x-calais-licenseID': apiKey
			}
		},
		function(res) {

		});
}

function send(postObject) {
	queue.append(postObject);

	consume();
}

exports.send = send;