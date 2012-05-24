var

async = require('async'),
fs = require('fs');

exports.compile = function(callback) {
	var

	root = __dirname + '/../templates/',
	templates = [
		root + '_conversation.ejs'
	];



	// fs.readFile('exports.compile',  root + '_conversation.ejs', function(err, result) {
	// 	console.log(result);
	// });


	async.map(templates, fs.readFile, callback);
};