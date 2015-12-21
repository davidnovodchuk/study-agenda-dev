'use strict';

var express = require('express');
var controller = require('./student.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');
var CONSANTS = require('../../lib/constants');
var USER_ROLES = CONSANTS.USER_ROLES;

var router = express.Router();

router.get('/me/courses-tasks', auth.hasRole(USER_ROLES.STUDENT), controller.myCoursesTasks);
router.put('/:id/add-task-modification', auth.hasRole(USER_ROLES.STUDENT), controller.addTaskModification);
router.get('/:id/enrollments', auth.hasRole(USER_ROLES.STUDENT), controller.getMyEnrollments);
router.get('/me/dashboard', auth.hasRole(USER_ROLES.STUDENT), controller.getSchedule);

module.exports = router;
