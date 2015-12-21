'use strict';

var User = require('./user.model');
var auth = require('../../auth/auth.service');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var CONSTANTS = require('../../lib/constants');
var USER_ROLES = CONSTANTS.USER_ROLES;
var _ = require('lodash');
var Q = require('q');
var Task = require('../task/task.model');
var School = require('../school/school.model');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = USER_ROLES.STUDENT;
  newUser.studyDays = [];
  // var today = new Date();

  for (var i = 0; i < 7; i++) {
    var studyDay = {};
    studyDay.day = new Date();
    studyDay.day.setDate(studyDay.day.getDate() + i - new Date().getDay());
    studyDay.minutes = 0;
    newUser.studyDays.push(studyDay);
  }
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Change users details, except for password
 */
exports.update = function(req, res, next) {
  var userId = req.body._id;

  if(req.body._id) {
    delete req.body._id;
  }

  // password can only be changed with changePassword
  if(req.body.hashedPassword) {
    delete req.body.hashedPassword;
  }

  // a user cannot change his role
  if(userId.toString() === req.user._id.toString()) {
    delete req.body.role;
  }

  // student can modify own information, admin can update others as well
  if(userId.toString() === req.user._id.toString() || !auth.hasRole(USER_ROLES.ADMIN)) {
    delete req.body.role;
  }

  return Q(
    User.findById(userId)
    .exec()
  )
  .then(function(user) {
    if(!user) {
      return res.send(404);
    }

    var updated = _.merge(user, req.body);

    if (req.body.studyDays) {
      updated.studyDays = req.body.studyDays;
    }

    if (req.body.enrollments) {
      updated.enrollments = req.body.enrollments;
    }

    return Q(
      updated.save()
    )
    .then(function(updatedUser) {
      return res.status(200).json(updatedUser);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}
