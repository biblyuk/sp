define([
	'jquery',
	'underscore',
	'text!templates/_conversation.ejs'
], function($, _, conversation_tmpl){
	var

	Renderer = {},
	els = {};




	function _onNewConversation(event, conversation) {
		var html = conversation_tmpl({ conversation: conversation, _: _ });
		$(html).appendTo(els.conversationList);
	}



	function _onAppStart() {

		// Cache the list elments
		els.conversationList = $('#js-conversation-list');

		// Compile the tmeplate function
		conversation_tmpl = _.template(conversation_tmpl);
	}

	$.subscribe('appStart', _onAppStart);
	$.subscribe('newConversation', _onNewConversation);


	return Renderer;
});
