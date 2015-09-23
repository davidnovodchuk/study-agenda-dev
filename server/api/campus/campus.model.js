'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CampusSchema = new Schema({
  name: String,
  address: String,
  school: {
    type: Schema.ObjectId,
    ref: 'sa_schools'
  },
  courses: [{
    type: Schema.ObjectId,
    ref: 'sa_courses'
  }]
})

module.exports = mongoose.model('sa_campuses', CampusSchema);
