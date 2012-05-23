var

request = require('request'),
apiKey = require('./apikeys').ftapi;


exports.search = function search(conversation) {

	var queryString = '"' + conversation.tags.join('" AND "') + '"';

/*
	{
		"queryString": queryString,
		"queryContext" : {
			"curations" : [ "ARTICLES"]
		}
	}
 */


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
		function(error, response, body) {
			console.log(response);
		}
	);

}

