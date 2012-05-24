/**
 * Pass data from Facebook, Twitter, etc. to OpenCalais for analysis, before routing to the grouping step.
 *
 * @fileOverview
 * @author Matthew Caruana Galizia
 */

var

http   = require('http'),
events = require('events'),

apiKey = require('../../data/apikeys.json').opencalais,

List   = require('../../base/list'),

queue  = new List(),
sent   = new List(),

emtr   = new events.EventEmitter(),




typeMapping = {

	"Product": {
		"ft": "brand",
		"key": "Product"
	},
	"ProductIssues": {
		"ft": "brand",
		"key": "Product"
	},
	"ProductRecall": {
		"ft": "brand",
		"key": "Product"
	},
	"ProductRelease": {
		"ft": "brand",
		"key": "Product"
	},
	"CompanyProduct": {
		"ft": "brand",
		"key": "Product"
	},
	"Company": {
		"ft": "companies",
		"key": "Company"
	},
	"Organization": {
		"ft": "organisations",
		"key": "Organization"
	},
	"Person": {
		"ft": "people",
		"key": "Person"
	},
	"Region": {
		"ft": "regions",
		"key": "Region"
	},
	"City": {
		"ft": "regions",
		"key": "City"
	},
	"Country": {
		"ft": "regions",
		"key": "Country"
	},
	"Continent": {
		"ft": "regions",
		"key": "Continent"
	},
	"ProvinceOrState": {
		"ft": "regions",
		"key": "ProvinceOrState"
	}
};








// The module is an EventEmitter
module.exports = emtr;







/**
 * Process an incoming OpenCalais response.
 *
 * @private
 * @param {Object} postObject The post object originally passed to the module
 * @param {string} ocResponse The raw response from OpenCalais
 */
function process(postObject, ocResponse) {
	var key1, obj, tag;

	try {
		ocResponse = JSON.parse(ocResponse);
	} catch (e) {
		if (e instanceof SyntaxError) {
			console.log("OpenCalais returned error");
		} else {
			console.error('Unable to parse OpenCalais response', e);
		}
		return;
	}

	for (key1 in ocResponse) {
		if (!ocResponse.hasOwnProperty(key1)) {
			continue;
		}

		obj = ocResponse[key1];

		if (!obj._type) {
			continue;
		}

		if (!postObject.tags) {
			postObject.tags = {};
		}

		// Companies typically come with a 'resolutions' array
		if (obj.resolutions && obj.resolutions.length) {

			// TODO:MCG: Get the resolution with the highest score
			tag = obj.resolutions[0];
		} else {
			tag = {
				id:   key1
			};
		}

		// Skip URLs
		if (tag.type === 'URL') {
			continue;
		}

		if (typeMapping[obj._type]) {
			tag.type = typeMapping[obj._type].ft;
		} else {
			tag.type = 'generic';
		}

		tag.name = obj.name;

		// Only add if "name" param is populated
		if (!tag.name) {
			continue;
		}

		// Further check for URLs
		if (tag.name.slice(0, 5) === 'http:') {
			continue;
		}

		// Ignore Tweets starting with RT - OpenCalais mistakenly tags 'RT' as a 'Position' type
		if (tag.name === 'RT' && postObject.provider === 'twitter' && postObject.message.slice(0, 2) === 'RT') {
			continue;
		}

		// Ignore wrongly tagged MT (mentioned tweet)
		if (postObject.provider === 'twitter' && tag.name.slice(0, 4) === 'MT @') {
			continue;
		}

		// The tags object is keyed by OpenCalais IDs, to easily avoid/detect dupes
		postObject.tags[tag.id] = tag;

		// COMPLEX:MCG: Add a count that will be incremented later
		tag.count = 1;
	}

	emtr.emit('processed', postObject);
}


/**
 * Consume a queued post object.
 *
 * @private
 */
function consume() {
	var req, postObject = queue.last;

	// Don't do anything if there's nothing in the queue
	if (!postObject) {
		return;
	}

	// Mark the request
	postObject.openCalaisTries = 1;
	queue.remove(postObject);
	sent.append(postObject);

	req = http.request({
			host: 'api.opencalais.com',
			path: '/tag/rs/enrich',
			method: 'POST',
			headers: {
				'x-calais-licenseID': apiKey,
				'content-type': 'text/raw',
				'accept': 'application/json',
				'enableMetadataType': 'GenericRelations,SocialTags',
				'content-length': postObject.message.length
			}

		},
		function(res) {
			var data = '';

			res.setEncoding('utf8');

			res.on('data', function(chunk) {
				data += chunk;
			});

			res.on('end', function() {
				sent.remove(postObject);

				process(postObject, data);
				consume();
			});
		});

	req.on('error', function(e) {
		console.error('OpenCalais module: problem with request', e, postObject);

		sent.remove(postObject);

		// Put the request back in the queue and try again if it failed less than three times
		if (postObject.openCalaisTries < 3) {
			queue.append(postObject);
			postObject.openCalaisTries++;
		}

		consume();
	});

	req.write(postObject.message, 'utf8');
	req.end();
}


/**
 * Queue a post for submission to OpenCalais.
 *
 * @param {Object} postObject The post object to be queued
 */
function send(postObject) {
	queue.append(postObject);

	consume();
}

emtr.send = send;
