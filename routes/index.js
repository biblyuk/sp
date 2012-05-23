var realtime = require('../helpers/realtime.js');

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
	realtime.broadcast('this message is going out to all users');
	res.send('Done');
};