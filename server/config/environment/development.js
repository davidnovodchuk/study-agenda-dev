'use strict';
var path = require('path')

var currentPath = __dirname;
// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  keyFile:  path.resolve(currentPath, '../../../server.key'),
  certFile: path.resolve(currentPath, '../../../server.crt'),

  mongo: {
    uri: 'mongodb://localhost/studyAgenda-dev'
  },

  seedDB: true
};
