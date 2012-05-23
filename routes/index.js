var realtime = require('../helpers/realtime.js');
var ft = require('../objects/ft.js');

/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', { title: 'Shortest Path' });
};

/*
 * GET test trigger for IO update
 */
exports.test = function(req, res) {
	realtime.broadcastSocial('this message is going out to all users');
	res.send('Done');
};

exports.testapi = function(req, res) {
	ft.search({
		social: [
			{}
		],
		tags: [
			"David Cameron", "banks"
		]
	});
	res.send('Done');
};