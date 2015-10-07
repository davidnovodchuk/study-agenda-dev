"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var Q = require("q");
var _ = require("lodash");

var SchoolSchema = new Schema({
	name: {
    type:String,
    required: true
  },
	campuses: [{
		type: Schema.ObjectId,
		ref: "sa_campuses"
	}]
});

// this function executes before school is removed
SchoolSchema.pre("remove", function(next) {
  Q(
    this.model("sa_schools").findById(this._id)
    .populate("campuses")
    .exec()
  )
  .then(function(school) {
    _.each(school.campuses, function(campus) {
      campus.remove();
    });
    next();
  })
  .fail(function(err) {
    next(err);
  });
});

module.exports = mongoose.model("sa_schools", SchoolSchema);