'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
	name: {
    type:String,
    required: true
  },
	campuses: [{
		type: Schema.ObjectId,
		ref: 'sa_campuses'
	}]
});

module.exports = mongoose.model('sa_schools', SchoolSchema);