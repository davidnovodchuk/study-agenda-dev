"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Q = require("q");
var _ = require("lodash");

var CourseSchema = new Schema({
  code: String,
  section: String,
  title: {
    type:String,
    required: true
  },
  campus: {
    type: Schema.ObjectId,
    ref: "sa_campuses"
  },
  tasks: [{
    type: Schema.ObjectId,
    ref: "sa_tasks"
  }]
})

// this function executes before course is removed
CourseSchema.pre("remove", function(next) {
  Q([
    this.model("sa_courses").findById(this._id)
    .populate("tasks")
    .exec(),

    this.model("sa_campuses").findById(this.campus)
    .exec()
  ])
  .spread(function(course, campus) {
    _.each(course.tasks, function(task) {
      task.remove();
    });

    campus.courses.pull(course._id);
    campus.save();

    next();
  })
  .fail(function(err) {
    next(err);
  });
});

module.exports = mongoose.model("sa_courses", CourseSchema);
