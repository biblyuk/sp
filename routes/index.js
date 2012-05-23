var

realtime = require('../helpers/realtime.js'),
tempalateCompiler = require('../helpers/templateCompiler');

/*
 * GET home page.
 */
exports.index = function(req, res){


	tempalateCompiler.compile(function(templates) {

		res.render('index', {
			title: 'Shortest Path',
			templates: templates
		});
	});
};

/*
 * GET test trigger for IO update
 */
exports.test = function(req, res) {
	Weibo.startStream();
	res.send('Done');
};