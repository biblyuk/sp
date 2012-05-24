var

Weibo = require('../realtime/objects/weibo.js'),
ft = require('../realtime/objects/ft.js'),
realtime = require('../realtime'),
testData = require('../data/testdata.json');

/*
 * GET home page.
 */
exports.index = function(req, res) {



	var mockConversation = {
		social: [
			{}
		],
		tags: [
			"David Cameron", "banks"
		]
	};

	ft.search(mockConversation);


	res.render('index', {
		title: 'Shortest Path'
	});
};

exports.pushNewConversation = function(req, res, next) {
	realtime.io.sockets.emit('newConversation', testData.conversation1);
	res.send(testData.conversation1);
};
