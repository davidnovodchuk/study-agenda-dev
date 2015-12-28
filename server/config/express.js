/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');


module.exports = function(app) {
  var fs = require('fs');
  var https = require('https');
  var httpsPort = 443;
  var options = {
    key: fs.readFileSync('/etc/letsencrypt/live/studyagenda.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/studyagenda.com/cert.pem')
  };

  var secureServer = https.createServer(options, app).listen(httpsPort);
  var env = app.get('env');

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());
  if ('production' === env) {
    app.set('port_https', httpsPort); // make sure to use the same port as above, or better yet, use the same variable
    // Secure traffic only
    app.all('*', function(req, res, next){
      if (req.secure) {
        return next();
      }
      res.redirect('https://'+req.hostname+':'+app.get('port_https')+req.url);
    });
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};
