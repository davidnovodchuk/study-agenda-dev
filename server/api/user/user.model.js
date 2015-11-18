'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var constants = require('../../lib/constants');
var USER_ROLES = constants.USER_ROLES;

var UserSchema = new Schema({
  name: String,
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true
  }, 
  role: {
    type: Number,
    default: USER_ROLES.STUDENT,
    required: true
  },
  hashedPassword: String,
  provider: String,
  salt: String,
  studyDays: [{
    day: {
      type: Date,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    }
  }],
  enrollments: [{
    school: {
      type: Schema.ObjectId,
      ref: 'sa_schools'
    },
    campuses: [{
      type: Schema.ObjectId,
      ref: 'sa_campuses'
    }],
    courses: [{
      type: Schema.ObjectId,
      ref: 'sa_courses'
    }]
  }],
  taskNotifications: [{
    task: {
      type: Schema.ObjectId,
      ref: 'sa_tasks'
    }
  }],
  // modifiedTasks types:
  // 1 : task completed
  // 2 : task does not apply to user
  // 3 : task applies to user (but not to other users)
  modifiedTasks: [{
    task: {
      type: Schema.ObjectId,
      ref: 'sa_tasks'
    },
    modificationType: Number
  }]  
});

/**
 * Virtuals
 */
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

// Public profile information
UserSchema
  .virtual('profile')
  .get(function() {
    return {
      '_id': this._id,
      'name': this.name,
      'role': this.role,
      'email': this.email
    };
  });

// Non-sensitive info we'll be putting in the token
UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    };
  });

/**
 * Validations
 */

// Validate empty email
UserSchema
  .path('email')
  .validate(function(email) {
    return email.length;
  }, 'Email cannot be blank');

// Validate empty password
UserSchema
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
  .path('email')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({email: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if(this.password.length < 6){
      next(new Error('Password must be at least 6 characters'))
    }

    if (!validatePresenceOf(this.hashedPassword))
      next(new Error('Invalid password'));
    else
      next();
  });

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('sa_users', UserSchema);
