"use strict";

var _ = require("lodash");
var Course = require("./course.model");
var Campus = require("../campus/campus.model");
var Q = require("q");

// Get list of all courses
exports.index = function(req, res) {
  return Q(
    Course.find()
    .exec()
  )
  .then(function (courses) {
    
    return res.status(200).json(courses);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single course
exports.show = function(req, res) {
  var courseId = req.params.id;

  return Q(
    Course.findById(courseId)
    .exec()
  )
  .then(function(course) {
    if(!course) { 
      return res.send(404); 
    }

    return res.json(course);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new course in the DB.
exports.create = function(req, res) {
  var newCourse = req.body;

  return Q(
    Course.create(newCourse)
  )
  .then(function(course) {

    return Q(
      Campus.findById(course.campus)
      .exec()
    )
    .then(function(campus) {
      campus.courses.push(course._id);

      return Q(
        campus.save()
      )
      .then(function () {

        return res.json(201, course);
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing course in the DB.
exports.update = function(req, res) {
  var courseId = req.body._id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    Course.findById(courseId)
    .exec()
  )
  .then(function(course) {
    if(!course) { 
      return res.send(404); 
    }

    var updated = _.merge(course, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(course);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Deletes a campus from the DB.
exports.destroy = function(req, res) {
  var courseId = req.params.id;

  return Q(
    Course.findById(courseId)
    .exec()
  )
  .then(function(course) {
    if(!course) { 
      return res.send(404); 
    }
    
    return Q(
      course.remove()
    )
    .then(function() {

      return res.send(204);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Get a single campus with its references populated
exports.showWithReferences = function(req, res) {
  var courseId = req.params.id;
  
  return Q(
    Course.findById(courseId)
    .populate("campus")
    .populate("tasks")
    .exec()
  )
  .then(function(course) {
    if(!course) { 
      return res.send(404); 
    }

    return res.json(course);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}