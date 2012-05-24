/**
 * Main application controller.
 *
 * @fileOverview
 * @author Wilson Page
 */

var

express  = require('express'),
routes   = require('./routes'),
realtime = require('./realtime');

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
	app.set('views', __dirname + '/templates');
	app.set('view engine', 'ejs');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use('/static', express['static'](__dirname + '/static'));
	app.use('/templates', express['static'](__dirname + '/templates'));

	// Init realtime server
	realtime.init(app);
});

app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
	app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/push/newconversation', routes.pushNewConversation);

app.listen(5000); // Must be reverse proxied from port 80
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
