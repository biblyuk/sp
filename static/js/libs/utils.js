define([
  'jquery'
], function($) {

	var exports = {};


	exports.getUrlQueryParams = function() {
		var

		params = {},
		a = /\+/g,  // Regex for replacing addition symbol with a space
		r = /([^&=]+)=?([^&]*)/g,
		d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
		q = window.location.search.substring(1);

		while (e = r.exec(q)) params[d(e[1])] = d(e[2]);

		return params;
	};


	return exports;
});
