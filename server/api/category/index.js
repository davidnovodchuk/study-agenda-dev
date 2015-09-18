'use strict';

var express = require('express');
var controller = require('./category.controller');
var auth = require('../../auth/auth.service');
var CONSANTS = require('../../lib/constants');
var USER_ROLES = CONSANTS.USER_ROLES;

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', auth.hasRole(USER_ROLES.ADMIN), controller.create);
router.put('/:id', auth.hasRole(USER_ROLES.ADMIN), controller.update);
router.patch('/:id', auth.hasRole(USER_ROLES.ADMIN), controller.update);
router.delete('/:id', auth.hasRole(USER_ROLES.ADMIN), controller.destroy);

module.exports = router;
