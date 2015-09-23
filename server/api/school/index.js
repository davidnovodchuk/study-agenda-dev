'use strict';

var express = require('express');
var controller = require('./school.controller');
var auth = require('../../auth/auth.service');
var CONSANTS = require('../../lib/constants');
var USER_ROLES = CONSANTS.USER_ROLES;

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.hasRole(USER_ROLES.ADMIN), controller.destroy);
router.get('/:id/with-campuses', auth.isAuthenticated(), controller.showWithCampuses);

module.exports = router;
