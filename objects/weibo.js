var

weibo = require('weibo');
openCalais = require ('./opencalais.js'),
apiKeys = require('./apikeys.js')
;

exports.startStream = function startStream() {

	var tapi = weibo.tapi;
	var appkey = 2669146070, secret = apiKeys.weibo;
	var oauth_callback_url = 'http://localhost:3000/testingweibo' || 'oob';
	tapi.init('tsina', appkey, secret, oauth_callback_url);
	tapi.friends({}, function(error, data, xhr) {
	    if(error) {
	        console.error(error);
	    } else {
	        console.log(data);
	    }
	});


};