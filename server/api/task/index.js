'use strict';

var express = require('express');
var controller = require('./task.controller');
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
router.get('/:id/with-references', auth.isAuthenticated(), controller.showWithReferences);
router.post('/:id/student-update/:studentId', auth.isAuthenticated(), controller.studentUpdate);

module.exports = router;
