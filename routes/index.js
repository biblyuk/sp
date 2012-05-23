var

realtime          = require('../helpers/realtime.js'),
tempalateCompiler = require('../helpers/templateCompiler'),
ft                = require('../objects/ft.js');


/*
 * GET home page.
 */
exports.index = function(req, res){


	tempalateCompiler.compile(function(templates) {

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
