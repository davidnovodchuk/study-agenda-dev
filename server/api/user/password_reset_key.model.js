'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PasswordResetKeySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'sa_users',
    required: true
  }
});

module.exports = mongoose.model('sa_password_reset_keys', PasswordResetKeySchema);
