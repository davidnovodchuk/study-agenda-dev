'use strict';

var express = require('express');
var controller = require('./publisher.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:publisherId/recipes', auth.isAuthenticated(), controller.getPublisherRecipes);

module.exports = router;
