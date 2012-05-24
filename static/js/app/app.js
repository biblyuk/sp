define([
	'jquery',
	'underscore',
	'modules/realtime',
	'modules/renderer'
], function($, _){
	var

	App = {};

	App.init = function() {
		$.publish('appStart');
	};

	return App;
});
