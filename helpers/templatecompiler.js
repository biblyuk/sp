var

async = require('async'),
fs = require('fs');

exports.compile = function(callback) {
	var

	root = __dirname + '/../templates/',
	templates = [
		root + '_conversation.ejs'
	];

	async.map(templates, fs.readFile, callback);
};