var

async = require('async'),
fs = require('fs');

exports.compile = function(callback) {
	var

	templates = [],
	root = __dirname + '/../templates/';


	fs.readFile('exports.compile',  root + '_conversation.ejs', function(err, result) {
		console.log(result);
	});


	async.map([
		root + '_conversation.ejs'
	], fs.readFile, callback);
};