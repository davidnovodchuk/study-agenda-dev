"use strict";

var _ = require("lodash");
var Task = require("./task.model");
var Course = require("../course/course.model");
var Q = require("q");
var CONSANTS = require("../../lib/constants");
var TASK_PRIVACY_TYPES = CONSANTS.TASK_PRIVACY_TYPES;

// Get list of all tasks
exports.index = function(req, res) {
  return Q(
    Task.find()
    .exec()
  )
  .then(function (tasks) {
    
    return res.status(200).json(tasks);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Get a single task
exports.show = function(req, res) {
  var taskId = req.params.id;

  return Q(
    Task.findById(taskId)
    .exec()
  )
  .then(function(task) {
    if(!task) { 
      return res.send(404); 
    }

    return res.json(task);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

// Creates a new task in the DB.
exports.create = function(req, res) {
  var newTask = req.body;

  if(!newTask.privacyType) {
    newTask.privacyType = TASK_PRIVACY_TYPES.PUBLIC;
  }

  return Q(
    Task.create(newTask)
  )
  .then(function(task) {

    return Q(
      Course.findById(task.course)
      .exec()
    )
    .then(function(course) {

      course.tasks.push(task._id);

      return Q(
        course.save()
      )
      .then(function () {

        return res.json(201, task);
      });
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

// Updates an existing task in the DB.
exports.update = function(req, res) {
  var taskId = req.body._id;

  if(req.body._id) { 
    delete req.body._id; 
  }

  return Q(
    Task.findById(taskId)
    .exec()
  )
  .then(function(task) {
    if(!task) { 
      return res.send(404); 
    }

    var updated = _.merge(task, req.body);

    return Q(
      updated.save()
    )
    .then(function() {

      return res.status(200).json(task);
    })
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports.destroy = function(req, res) {
  var taskId = req.params.id;

  return Q(
    Task.findById(taskId)
    .exec()
  )
  .then(function(task) {
    if(!task) { 
      return res.send(404); 
    }

    return Q(
      task.remove()
    )
    .then(function() {

      return res.send(204);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports.showWithReferences = function(req, res) {
  var taskId = req.params.id;
  
  return Q(
    Task.findById(taskId)
    .populate("course")
    .exec()
  )
  .then(function(task) {
    if(!task) { 
      return res.send(404); 
    }

    return res.json(task);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}