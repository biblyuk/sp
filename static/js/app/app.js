define([
	'jquery',
	'underscore',
	'modules/realtime',
	'text!templates/_conversation.ejs'
], function($, _, Realtime, conversation_tmpl){
	var

	App = {};

	App.init = function() {
		console.log('init', conversation_tmpl);
		$.publish('appstart');
	};

	return App;
});
