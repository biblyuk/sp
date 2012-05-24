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
 * Load a full article.
 *
 * @private
 */
function loadFullContent(conversation, url) {

	request({
			method: "GET",
			uri: url + "?apiKey=" + apiKey
		},

		function(error, response, body) {

			var article;

			if (response && response.statusCode === 200) {

				try {
					article = JSON.parse(body).item;
				} catch (e) {
					console.error('Unable to parse Content API response', e);
					return;
				}

				article = {
					"excerpt":     article.summary.excerpt,
					"image":       (article.images ? article.images[0] : ''),
					"publishDate": article.lifecycle.initialPublishDateTime,
					"title":       article.title.title,
					"uri":         article.location.uri
				};

				conversation.articles.push(article);

				if (conversation.pendingArticleCount === conversation.articles.length) {
					emtr.emit('processed', conversation);
				}

			} else {
				console.log('Content API error: '+ ((response && response.statusCode) || '(unknown)'));
				console.log(body);
				conversation.pendingArticleCount--;
			}
		});
}


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
	function compare(a,b) {
		if (parseInt(a.count,10) < parseInt(b.count,10)) {
			return -1;
		}
		if (parseInt(a.count,10) > parseInt(b.count,10)) {
			return 1;
		}
		return 0;
	}

	var tagsArray = [];

	Object.keys(conversation.tags).map(function(id) {
		tagsArray.push(conversation.tags[id]);
	});

	tagsArray.sort(compare);

	conversation.tags = {};
	var id=0;
	while(id < 3 && tagsArray[id]){
		var tag = tagsArray[id];

		if (tag.type === 'generic') {
			return;
		}

		conversation.tags[id] = tag;

		queryParams.push(tag.type + ':"' + tag.name + '"');
		id++;
	}

	if (!queryParams.length) {
		return;
	}

	queryString = queryParams.join(' AND ');
	queryString += ' AND (initialPublishDateTime:>2012-05-16T00:00:00Z)';


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

	// Post to the Search API
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

		function(error, response, body) {

			var i, l, resultSet;

			if (response && response.statusCode === 200) {
				if (!body.results[0]) {
					return;
				}

				resultSet = body.results[0];

				if (!resultSet.indexCount) {
					console.log('\n\n No results for Search API query:\n' + queryString + '\n\n');
					emtr.emit('processed', conversation);
					return;
				}

				conversation.pendingArticleCount = resultSet.results.length;
				conversation.articles = [];

				for (i = 0, l = resultSet.results.length; i < l; i++) {

					// Load each article from the Content API
					loadFullContent(conversation, resultSet.results[i].apiUrl);
				}

			} else {

				// NB: 429 is throttled
				console.log('Search API error: '+ ((response && response.statusCode) || '(unknown)'));
				console.log(body);
			}
		}
	);

}

emtr.search = search;
