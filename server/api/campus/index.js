'use strict';

var express = require('express');
var controller = require('./campus.controller');
var auth = require('../../auth/auth.service');
var constants = require('../../lib/constants');
var USER_ROLES = constants.USER_ROLES;

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
