"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Q = require("q");

var TaskSchema = new Schema({
  name: {
    type:String,
    required: true
  },
  weight: { 
    type: Number, 
    min: 0,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  // TODO: Add task privacy types
  // privacyType specifies if:
  // 1 - task is public
  // 2 - task is privare
  // 3 - task applies to specified users
  privacyType: {
    type: Number,
    required: true
  },
  course: {
    type: Schema.ObjectId,
    ref: "sa_courses",
    required: true
  }
});

// this function executes before task is removed
TaskSchema.pre("remove", function(next) {
  Q([
    this.model("sa_courses").findById(this.course)
    .exec(),

    this._id
  ])
  .spread(function(course, taskId) {
    course.tasks.pull(taskId);
    course.save();

    next();
  })
  .fail(function(err) {
    next(err);
  });
});

module.exports = mongoose.model("sa_tasks", TaskSchema);
