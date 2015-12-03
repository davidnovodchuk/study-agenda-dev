/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var constants = require('../lib/constants');
var USER_ROLES = constants.USER_ROLES;

User.find(function(err, users) {
  if(!users.length) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        role: USER_ROLES.STUDENT,
        name: 'Student',
        email: 'student@sa.com',
        password: 'student'
      }, {
        provider: 'local',
        role: USER_ROLES.ADMIN,
        name: 'Admin',
        email: 'admin@sa.com',
        password: 'admin'
      }, function() {
          console.log('finished populating users');
        }
      );
    });
  }
});
