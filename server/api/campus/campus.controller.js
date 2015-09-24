"use strict";

var _ = require("lodash");
var Campus = require("./campus.model");
var User = require("../user/user.model");
var School = require("../school/school.model");
var Q = require("q");

// Get list of all campuses
exports.index = function(req, res) {
  return Q(
    Campus.find()
    .exec()
  )
  .then(function (campuses) {
    
    return res.status(200).json(campuses);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single campus
exports.show = function(req, res) {
  var campusId = req.params.id;

  return Q(
    Campus.findById(campusId)
    .exec()
  )
  .then(function(campus) {
    if(!campus) { 
      return res.send(404); 
    }

    return res.json(campus);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};


// Get a single campus with its references populated
exports.showWithReferences = function(req, res) {
  var campusId = req.params.id;
  
  return Q(
    Campus.findById(campusId)
    .populate("school")
    .populate("courses")
    .exec()
  )
  .then(function(campus) {
    if(!campus) { 
      return res.send(404); 
    }

    return res.json(campus);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new campus in the DB.
exports.create = function(req, res) {
  var newCampus = req.body;

  return Q(
    Campus.create(newCampus)
  )
  .then(function(campus) {

    return Q(
      School.findById(campus.school)
      .exec()
    )
    .then(function(school) {

      school.campuses.push(campus._id);

      return Q(
        school.save()
      )
      .then(function () {

        return res.json(201, campus);
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing campus in the DB.
exports.update = function(req, res) {
  var campusId = req.body._id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    Campus.findById(campusId)
    .exec()
  )
  .then(function(campus) {
    if(!campus) { 
      return res.send(404); 
    }

    var updated = _.merge(campus, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(campus);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Deletes a campus from the DB.
exports.destroy = function(req, res) {
  var campusId = req.params.id;

  return Q(
    Campus.findById(campusId)
    .exec()
  )
  .then(function(campus) {
    if(!campus) { 
      return res.send(404); 
    }

    return Q(
      campus.remove()
    )
    .then(function() {

      return res.send(204);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}