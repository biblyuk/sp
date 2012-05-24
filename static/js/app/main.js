// RequireJS Configuration
require.config({
	paths: {
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min',
		underscore: '../libs/underscore/underscore-amd',
		utils: '../libs/utils/utils',
		templates: '/templates',
		text: '../libs/require/text',
		order: '../libs/require/order'
	}
});


// Load first modules
require([
	'order!../libs/jquery/plugins',
	'order!app'
], function($, app) {

	app.init();
});