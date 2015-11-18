'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var CONSANTS = require('../../lib/constants');
var USER_ROLES = CONSANTS.USER_ROLES;

var router = express.Router();

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);

// admin routes
router.get('/', auth.hasRole(USER_ROLES.ADMIN), controller.index);
router.delete('/:id', auth.hasRole(USER_ROLES.ADMIN), controller.destroy);

module.exports = router;
