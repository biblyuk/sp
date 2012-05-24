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

/*
 * GET test trigger for IO update
 */
exports.test = function(req, res) {
	Weibo.startStream();
	res.send('Done');
};


exports.pushNewConversation = function(req, res, next) {
	realtime.io.sockets.emit('newConversation', testData.conversation1);
	res.send(testData.conversation1);
};
