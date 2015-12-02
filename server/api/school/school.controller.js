"use strict";

var _ = require("lodash");
var School = require("./school.model");
var Q = require("q");

// Get list of schools
exports.index = function(req, res) {
  return Q(
    School.find()
    .sort('name')
    .exec()
  )
  .then(function (schools) {
    
    return res.status(200).json(schools);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single school
exports.show = function(req, res) {
  return Q(
    School.findById(req.params.id)
    .exec()
  )
  .then(function(school) {
    if(!school) { 
      return res.send(404); 
    }

    return res.json(school);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single school with its campuses populated
exports.showWithReferences = function(req, res) {
  return Q(
    School.findById(req.params.id)
    .populate("campuses")
    .exec()
  )
  .then(function(school) {
    if(!school) { 
      return res.send(404); 
    }

    return res.json(school);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new school in the DB.
exports.create = function(req, res) {
  var newSchool = req.body;

  return Q(
    School.create(newSchool)
  )
  .then(function(school) {

    return res.status(201).json(school);
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing school in the DB.
exports.update = function(req, res) {
  var schoolId = req.params.id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    School.findById(schoolId)
    .exec()
  )
  .then(function(school) {
    if(!school) { 
      return res.send(404); 
    }

    var updated = _.merge(school, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(school);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Deletes a school from the DB.
exports.destroy = function(req, res) {
  var schoolId = req.params.id;

  return Q(
    School.findById(schoolId)
    .exec()
  )
  .then(function(school) {
    if(!school) { 

      return res.send(404); 
    }

    return Q( 
      school.remove()
    )
    .then(function() {

      return res.sendStatus(204);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}