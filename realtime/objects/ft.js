/**
 * Pass data from Facebook, Twitter, etc. to OpenCalais for analysis, before routing to the grouping step.
 *
 * @fileOverview
 * @author George Crawford
 */

var

request = require('request'),
events  = require('events'),

apiKey  = require('./apikeys').ftapi,

emtr    = new events.EventEmitter();

// The module is an EventEmitter
module.exports = emtr;


/**
 * Handle the response from a search API request.
 *
 * @param {Object} error
 * @param {Object} response
 * @param {Object} body
 * @param {Object} conversation
 */
function handleSearchResponse(error, response, body, conversation) {

	if (!body || !body.results) {
		return;
	}

	body.results[0].results.forEach(function _processResults(item) {

		conversation.ft.push({
			title:       item.title,
			summary:     item.summary,
			publishDate: item.lifecycle.initialPublishDateTime,
			url:         item.location.uri
		});
	});

	emtr.emit('processed', conversation);
}


/**
 * Search the content API for articles relevant to the given conversation.
 *
 * @param {Object} conversation
 */
function search(conversation) {

	var queryString, tags;

	// The tags property is an object, keyed by OpenCalais tag ID
	tags = Object.keys(conversation.tags).map(function(t) {
		return t.name;
	});

	queryString = '"' + tags.join('" AND "') + '"';

	conversation.ft = [];


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

	queryString += ' AND (initialPublishDateTime:>2012-05-16T00:00:00Z)';

	request({
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
			handleSearchResponse(error, response, body, conversation);
	});

}

emtr.search = search;
