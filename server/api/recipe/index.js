'use strict';

var express = require('express');
var controller = require('./recipe.controller');
var auth = require('../../auth/auth.service');
var constants = require('../../lib/constants');
var USER_ROLES = constants.USER_ROLES;

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole(USER_ROLES.STUDENT), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
