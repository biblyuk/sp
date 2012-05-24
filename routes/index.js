var

templateCompiler = require('../helpers/templatecompiler.js'),
Weibo            = require('../realtime/objects/weibo.js'),
ft               = require('../realtime/objects/ft.js');

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
