/**
 * Poll Facebook users.
 *
 * @fileOverview
 * @author Matthew Caruana Galizia
 */

var

events   = require('events'),
emtr     = new events.EventEmitter(),

apiKey   = require('./apikeys.js').facebook;

// The module is an EventEmitter
module.exports = emtr;


/**
 * Start polling users.
 *
 * @public
 */
function startPolling() {

	// TODO:MCG
}

emtr.startPolling = startPolling;