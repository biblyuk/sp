define([
	'jquery'
], function($){
	var

	exports = {};


	(function(){
		var

		msPerMinute = 60 * 1000,
		msPerHour   = msPerMinute * 60,
		msPerDay    = msPerHour * 24,
		msPerMonth  = msPerDay * 30,
		msPerYear   = msPerDay * 365;
		  
		
		exports.relativeTime = function(timestamp){
			var
			
			now = new Date(),
			then = new Date(timestamp),
			elapsed = now - then;
			
			if(elapsed < msPerMinute){
				 return Math.round(elapsed/1000) + ' seconds ago';   
			}else if(elapsed < msPerHour){
				 return Math.round(elapsed/msPerMinute) + ' minutes ago';   
			}else if(elapsed < msPerDay){
				 return Math.round(elapsed/msPerHour ) + ' hours ago';   
			}else if(elapsed < msPerMonth){
				 return Math.round(elapsed/msPerDay ) + ' days ago';   
			}else if(elapsed < msPerYear){
				 return Math.round(elapsed/msPerMonth ) + ' months ago';   
			}else{
				 return Math.round(elapsed/msPerYear ) + ' years ago';   
			}
		};
	})(); 


	return exports;
});
