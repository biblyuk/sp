
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	helpers = require('./helpers'),
	Twitter = require("./objects/twitter.js");

Twitter.startStream();

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
	app.set('views', __dirname + '/templates');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use('/static', express['static'](__dirname + '/static'));


	// Init realtime stuff
	helpers.realtime.init(app);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/test', routes.test);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
