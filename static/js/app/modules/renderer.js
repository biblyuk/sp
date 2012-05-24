define([
	'jquery',
	'underscore',
	'../../libs/utils/utils',
	'text!templates/_conversation.ejs'
], function($, _, Utils, conversation_tmpl){
	var

	Renderer = {},
	$els = {};




	function _onNewConversation(event, conversation) {
		var html, existingConversion;

		console.log('New conversation received:', conversation);

		// Covert timestapm pto relative time
		//conversation.time = Utils.relativeTime(conversation.timestamp);
		html = conversation_tmpl({ conversation: conversation, _: _, toRelativeTime: Utils.relativeTime }),
		existingConversion = $('#js-conversation-' + conversation.id);

		// If an exisitng conversation with this id exists
		if (existingConversion.length) {

			// remove the existing conversation
			existingConversion.remove();
		}

		$($els.conversationList).prepend(html);


	}



	function _onAppStart() {

		// Cache the list elments
		$els.conversationList = $('#js-conversation-list');

		// Compile the template function
		conversation_tmpl = _.template(conversation_tmpl);
	}

	$.subscribe('appStart', _onAppStart);
	$.subscribe('newConversation', _onNewConversation);


	return Renderer;
});
