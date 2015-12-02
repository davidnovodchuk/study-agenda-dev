'use strict';

var User = require('../user/user.model');
var Task = require('../task/task.model');
var _ = require('lodash');
var Q = require('q');

exports.myCoursesTasks = function(req, res) {
  var studentId = req.user._id;

  return Q(
    User.findById(studentId)
    .populate(['enrollments.courses','modifiedTasks.task'])
    .select('enrollments.courses modifiedTasks')
    .exec()
  )
  .then(function(student){
    return User.populate(student, {
      path: 'enrollments.courses.tasks',
      model: Task
    });
  })
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    return res.json(student);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

exports.addTaskModification = function(req, res) {
  var studentId = req.user._id;
  var newTaskModification = req.body.newTaskModification;

  if (req.params.id !== 'me') {
    studentId = req.params.id;
  }

  return Q(
    User.findById(studentId)
    .select('-hashedPassword -salt')
    .exec()
  )
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    var taskToModify = _.findWhere(student.modifiedTasks, function(modifiedTask) {
      return modifiedTask.task.toString() === newTaskModification.task.toString();
    });

    if (taskToModify) {
      taskToModify.modificationType = newTaskModification.modificationType;
    } else {
      student.modifiedTasks.push(newTaskModification);
    }

    return Q(
      student.save()
    )
    .then(function(student) {

      return res.status(200).json(student);
    });
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

exports.getMyEnrollments = function(req, res) {
  var studentId = req.user._id;

  return Q(
    User.findById(studentId)
    .populate(['enrollments.school', 'enrollments.campuses', 'enrollments.courses'])
    .select('enrollments._id enrollments.school enrollments.campuses enrollments.courses')
    .exec()
  )
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    return res.json(student);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
}

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

function handleError(res, err) {
  return res.send(500, err);
}
