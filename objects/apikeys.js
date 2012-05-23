/**
 * @author Matthew Caruana Galizia
 */

var apiKeys, fs = require('fs');

try {
	apiKeys = JSON.parse(fs.readFileSync('./data/apikeys.json', 'utf8'));
} catch (e) {
	console.error('Unable to find API keys file. Is data/apikeys.json available and readable?');
	process.exit(1);
}

module.exports = apiKeys;