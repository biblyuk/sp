var realtime = require('../helpers/realtime.js');

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { title: 'Shortest Path' });
};

exports.test = function(req, res) {
	realtime.broadcast('this message is going out to all users');
	res.send('Done');
};