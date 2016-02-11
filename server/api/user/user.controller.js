'use strict';

var User = require('./user.model');
var auth = require('../../auth/auth.service');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var CONSTANTS = require('../../lib/constants');
var USER_ROLES = CONSTANTS.USER_ROLES;
var SENDGRID = CONSTANTS.SENDGRID;
var APP_URL = CONSTANTS.APP.URL;
var _ = require('lodash');
var Q = require('q');
var Task = require('../task/task.model');
var School = require('../school/school.model');
var sendgrid  = require('sendgrid')(SENDGRID.API_KEY);
var ActivationKey = require('./activation_key.model');
var PasswordResetKey = require('./password_reset_key.model');

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
  newUser.isActivated = false;
  newUser.createdOn = new Date();

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

    var activationKey = new ActivationKey();
    activationKey.user = user._id;

    return Q(
      activationKey.save()
    )
    .then(function() {

      var options = {
        user: user,
        activationUrl: APP_URL + '/activate/' + activationKey._id
      }

      return Q(
        exports._prepareActivationEmail(options)
      )
      .then(function(email) {

        sendgrid.send(email, function(err, json) {
          if (err) {

            return handleError(res, err);
          } else {

            res.json({ token: token });
          }
        });
      });
    });
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

exports.activate = function(req, res) {
  var activationKeyId = req.params.activationKey;

  return Q(
    ActivationKey.findById(activationKeyId)
    .exec()
  )
  .then(function(activationKey) {

    return Q(
      User.findById(activationKey.user)
      .exec()
    )
    .then(function(user) {
      if(!user.isActivated) {
        user.isActivated = true;

        return Q(
          user.save()
        )
        .then(function() {

          return res.status(200).json({message: 'Account successfully activated'});
        });
      } else {
        return res.status(200).json({message: 'Account is activate'});
      }
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports.reSendActivation = function(req, res) {
  var userId = req.user._id;

  return Q(
    ActivationKey.findOne()
    .where('user').equals(userId)
    .populate('user')
    .exec()
  )
  .then(function(activationKey) {

    var options = {
      user: req.user,
      activationUrl: APP_URL + '/activate/' + activationKey._id
    }

    return Q(
      exports._prepareActivationEmail(options)
    )
    .then(function(email) {

      sendgrid.send(email, function(err, json) {
        if (err) {

          return handleError(res, err);
        } else {

          return res.status(200).json({message: 'Activation email was sent'});
        }
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports._prepareActivationEmail = function(options) {
  options = options || {};
  var user = options.user;
  var activationUrl = options.activationUrl;
  var email = new sendgrid.Email();

  email.addTo(user.email);
  email.subject = "Study Agenda Account Activation";
  email.from = 'support@studyagenda.com';
  email.text = 'Study Agenda activation email';
  email.html = '<h4>Hi ' + user.firstName + ',</h4>' +
               '<p>Thank you for creating an account at Study Agenda!</p>' +
               '<p>In order to activate you new account, please confirm your email by clicking the link below:<br />' +
               '<a href="' + activationUrl + '">' + activationUrl + '</a></p>';

  // add filter settings one at a time
  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', '1ec7ab74-ba94-4a5c-ac68-43bf144be807');

  return email;
};

exports.sendForgotPasswordEmail = function(req, res) {
  var emailAddress = req.params.emailAddress;

  return Q(
    User.findOne()
    .where('email').equals(emailAddress)
    .exec()
  )
  .then(function(user) {
    if(!user) {
      throw new Error('The provided email does not exist in the system');
    }

    var passwordResetKey = new PasswordResetKey();
    passwordResetKey.user = user._id;

    return Q(
      passwordResetKey.save()
    )
    .then(function() {

      var options = {
        user: user,
        passwordRecovertUrl: APP_URL + '/password-reset/' + passwordResetKey._id
      }

      return Q(
        exports._prepareForgotPasswordEmail(options)
      )
      .then(function(email) {

        sendgrid.send(email, function(err, json) {
          if (err) {

            var error = {
              message: 'The system could not send the password reset email. Please try again'
            };

            return handleError(res, error);
          } else {

            return res.status(200).json({message: 'Password reset email was sent'});
          }
        });
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports._prepareForgotPasswordEmail = function(options) {
  options = options || {};
  var user = options.user;
  var passwordRecovertUrl = options.passwordRecovertUrl;
  var email = new sendgrid.Email();

  email.addTo(user.email);
  email.subject = "Study Agenda Password Reset";
  email.from = 'support@studyagenda.com';
  email.text = 'Study Agenda password reset';
  email.html = '<h4>Hi ' + user.firstName + ',</h4>' +
               '<p>In order to reset your password, please follow the link below:<br />' +
               '<a href="' + passwordRecovertUrl + '">' + passwordRecovertUrl + '</a></p>';

  // add filter settings one at a time
  email.addFilter('templates', 'enable', 1);
  email.addFilter('templates', 'template_id', '1ec7ab74-ba94-4a5c-ac68-43bf144be807');

  return email;
};

exports.getPasswordResetInfo = function(req, res) {
  var passwordResetId = req.params.passwordResetId;

  return Q(
    PasswordResetKey.findById(passwordResetId)
    .populate('user','_id')
    .lean()
    .exec()
  )
  .then(function(passwordResetKey) {
    if (!passwordResetKey.user) {
      throw new Error();
    }

    return Q.all([
      ActivationKey.findOne()
      .where('user').equals(passwordResetKey.user)
      .exec(),

      PasswordResetKey.find()
      .where('user').equals(passwordResetKey.user)
      .remove()
      .exec()
    ])
    .spread(function(activationKey, student) {
      if (!activationKey) {
        throw new Error();
      }

      passwordResetKey.user.key = activationKey._id;

      return res.status(200).json(passwordResetKey.user);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports.resetPassword = function(req, res) {
  var userId = req.body._id;
  var activationKey = req.body.key;
  var newPassword = String(req.body.password);

  return Q.all([
    ActivationKey.findById(activationKey)
    .exec(),

    User.findById(userId)
    .exec()
  ])
  .spread(function(validActivationKey, user) {
    if (!validActivationKey || !user || validActivationKey.user.toString() !== userId.toString()) {
      throw new Error();
    }
    user.password = newPassword;

    return Q(
      user.save()
    )
    .then(function() {

      return res.status(200).json({message: 'Password was reset'});
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.status(500).send(err.message);
}
