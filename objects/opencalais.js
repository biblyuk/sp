/**
 * Pass data from Facebook, Twitter, etc. to OpenCalais for analysis, before routing to the grouping step.
 *
 * @fileOverview
 * @author Matthew Caruana Galizia
 */

var 

http = require('http'),
List = require('./base/list'),
apiKey = require('./apikeys').opencalais,
queue = new List(),
sent = new List();


/**
 * Process an incoming OpenCalais response.
 *
 * @param {Object} postObject The post object originally passed to the module
 * @param {string} ocResponse The raw response from OpenCalais
 */
function process(postObject, ocResponse) {
	try {
		ocResponse = JSON.parse(ocResponse);
	} catch (e) {
		console.error('Unable to parse OpenCalais response', e);

		return;
	}
}

function consume() {
	var req, last = queue.last;

	// Don't do anything if there's nothing in the queue
	if (!last) {
		return;
	}

	req = http.request({
			host: 'api.opencalais.com',
			path: '/tag/rs/enrich',
			method: 'POST',
			headers: {
				'x-calais-licenseID': apiKey,
				'content-type': 'text/raw',
				'accept': 'application/json'
			}
		},
		function(res) {
			var data = '';

			res.setEncoding('utf8');

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				sent.remove(last);

				process(last, data);
			});
		});

	req.on('error', function(e) {
		console.log('Problem with request', e, last);

		sent.remove(last);
		queue.append(last);
	});

	req.write('<c:params xmlns:c="http://s.opencalais.com/1/pred/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><c:processingDirectives c:contentType="text/raw" c:enableMetadataType="GenericRelations,SocialTags" c:calculateRelevanceScore="true" c:outputFormat="application/json" c:docRDFaccesible="false" ></c:processingDirectives><c:userDirectives c:allowDistribution="false" c:allowSearch="false"></c:userDirectives><c:externalMetadata></c:externalMetadata></c:params>', 'utf8');
	req.end();
}

function send(postObject) {
	queue.append(postObject);

	consume();
}

exports.send = send;