'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivationKeySchema = new Schema({
  user: {
    type: Schema.ObjectId,
    ref: 'sa_users',
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('sa_activation_keys', ActivationKeySchema);
