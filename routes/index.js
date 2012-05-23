var

realtime          = require('../helpers/realtime.js'),
tempalateCompiler = require('../helpers/templateCompiler'),
Weibo             = require('../objects/weibo.js'),
ft                = require('../objects/ft.js');

realtime         = require('../helpers/realtime.js'),
templateCompiler = require('../helpers/templateCompiler'),
Weibo            = require('../objects/weibo.js')

;

/*
 * GET home page.
 */
exports.index = function(req, res){


	templateCompiler.compile(function(templates) {

		res.render('index', {
			title: 'Shortest Path',
			templates: templates
		});

		var mockConversation = {
			social: [
				{}
			],
			tags: [
				"David Cameron", "banks"
			]
		};

		ft.search(mockConversation);

	});
};

/*
 * GET test trigger for IO update
 */
exports.test = function(req, res) {
	Weibo.startStream();
	res.send('Done');
};
