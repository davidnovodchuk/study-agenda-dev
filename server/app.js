/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var fs = require('fs');

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
var sslOptions = {
  key: fs.readFileSync(config.keyFile),
  cert: fs.readFileSync(config.certFile)
}
var sslServer = require('https').createServer(sslOptions,app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

sslServer.listen(config.sslPort, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.sslPort, app.get('env'));
});
// Start SSL server


// Expose app
exports = module.exports = app;
