/**
 * Pass data from Facebook, Twitter, etc. to OpenCalais for analysis, before routing to the grouping step.
 *
 * @fileOverview
 * @author George Crawford
 */

var

request = require('request'),
events  = require('events'),
apiKey  = require('../../data/apikeys.json').ftapi,
emtr    = new events.EventEmitter();

// The module is an EventEmitter
module.exports = emtr;



/**
 * Search the content API for articles relevant to the given conversation.
 *
 * @param {Object} conversation
 */
function search(conversation) {

	var queryParams = [],
	    queryString,
	    tags = [];

	// The tags property is an object, keyed by OpenCalais tag ID
	Object.keys(conversation.tags).map(function(id) {

		var tag = conversation.tags[id];

		if (tag.type == 'generic') {
			return;
		}

		console.log(tag);

		queryParams.push(tag.type + ':"' + tag.name + '"');
	});

	if (!queryParams.length) return;

	queryString = queryParams.join(' AND ');
	queryString += ' AND (initialPublishDateTime:>2012-05-16T00:00:00Z)';

	conversation.ft = [];

	console.log('\n\n', queryString, '\n\n', conversation.tags, '\n\n');

	return;


/*
	Valid query fields:

	"apiUrl",
	"brand",
	"byline",
	"companies",
	"genre",
	"icb",
	"id",
	"initialPublishDateTime",
	"iptc",
	"lastPublishDateTime",
	"masterEntityId",
	"masterSource",
	"organisations",
	"people",
	"primarySection",
	"primaryTheme",
	"regions",
	"sections",
	"specialReports",
	"subjects",
	"title",
	"topics",
	"uri"


	Results:


	   "aspectSet":"article",
	   "aspects":[
			"body",
			"editorial",
			"images",
			"lifecycle",
			"location",
			"master",
			"metadata",
			"package",
			"packaging",
			"provenance",
			"summary",
			"title"
	   ],
	   "id":"cbc4a190-638d-11e1-8e79-00144feabb8e",
	   "apiUrl":"http://api.ft.com/content/items/v1/cbc4a190-638d-11e1-8e79-00144feabb8e",
	   "title":{
		  "title":"US banks will merge to survive, says report"
	   },
	   "lifecycle":{
		  "initialPublishDateTime":"2012-03-01T11:11:48.000Z",
		  "lastPublishDateTime":"2012-03-01T11:11:48.000Z"
	   },
	   "location":{
		  "uri":"http://www.ft.com/cms/s/0/cbc4a190-638d-11e1-8e79-00144feabb8e.html"
	   },
	   "summary":{
		  "excerpt":"Large US regional banks will need to cut expenses by up to 40 per cent to cope with slower economic growth, increasing"
	   },
	   "master":{
		  "masterSource":"Methode",
		  "masterEntityId":"cbc4a190-638d-11e1-8e79-00144feabb8e"
	   }
*/

	request(
		{
			method: "POST",
			uri: "http://api.ft.com/content/search/v1?apiKey=" + apiKey,
			json: {
				"queryString": queryString,
				"queryContext" : {
					"curations" : ["ARTICLES", "BLOGS"]
				},
				"resultContext" : {
					 "maxResults" : "10"
				}
			}
		},

		function _resp(error, response, body) {

			var i, l, resultSet;

			if (response && response.statusCode == 200) {

				for (i = 0, l = body.results.length; i < l; i++) {
					resultSet = body.results[i];

					if (!resultSet.indexCount) continue;

					resultSet.results.forEach(function _processResults(item) {
						_loadFullContent(conversation, item.apiUrl);
					});
				}

			} else {

				// NB: 429 is throttled
				console.log('Search API error: '+ ((response && response.statusCode) || '(unknown)'));
				console.log(body);
			}
		}
	);

}

function _loadFullContent(conversation, url) {


	request(
		{
			method: "GET",
			uri: url + "?apiKey=" + apiKey
		},

		function _resp(error, response, body) {

			var articleJson, article;

			if (response && response.statusCode == 200) {

				try {
					articleJson = JSON.parse(body);
					articleJson = articleJson.item;
				} catch (e) {
					console.error('Unable to parse Content API response', e);
					return;
				}

				var article = {
					"excerpt" : articleJson.summary.excerpt,
					"image": (articleJson.images ? articleJson.images[0] : []),
					"publishDate" : articleJson.lifecycle.initialPublishDateTime,
					"title" : articleJson.title.title,
					"uri" : articleJson.location.uri
				};
				console.log(article);

			} else {
				console.log('Content API error: '+ ((response && response.statusCode) || '(unknown)'));
				console.log(body);
			}
		}
	);


// 	emtr.emit('processed', conversation);
}


emtr.search = search;
