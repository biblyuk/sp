var

request = require('request'),
helpers = require('../helpers'),
apiKey  = require('./apikeys').ftapi;


exports.search = function search(conversation) {

	var queryString = '"' + conversation.tags.join('" AND "') + '"';

	conversation.ft = [];

	request.post(
		"http://api.ft.com/content/search/v1?apiKey=" + apiKey,
		{
			json: {
				"queryString": queryString,
				"queryContext" : {
					"curations" : ["ARTICLES"]
				}
			}
		},

		function _handleSearchResponse(error, response, body) {

			body.results[0].results.forEach(function _processResults(item) {

				conversation.ft.push({
					title: item.title,
					summary: item.summary
				});
			});

			helpers.realtime.broadcastConversation(conversation);
		}
	);

}

