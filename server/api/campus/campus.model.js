"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Q = require("q");
var _ = require("lodash");

var CampusSchema = new Schema({
  name: String,
  address: String,
  school: {
    type: Schema.ObjectId,
    ref: "sa_schools"
  },
  courses: [{
    type: Schema.ObjectId,
    ref: "sa_courses"
  }]
})

// this function executes before campus is removed
CampusSchema.pre("remove", function(next) {
  Q([
    this.model("sa_campuses").findById(this._id)
    .populate("courses")
    .exec(),

    this.model("sa_schools").findById(this.school)
    .exec()
  ])
  .spread(function(campus, school) {
    _.each(campus.courses, function(course) {
      course.remove();
    });

    school.campuses.pull(campus._id);
    school.save();

    next();
  })
  .fail(function(err) {
    next(err);
  });
});

module.exports = mongoose.model("sa_campuses", CampusSchema);
