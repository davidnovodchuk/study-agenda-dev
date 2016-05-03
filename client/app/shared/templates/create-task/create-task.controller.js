'use strict';

angular.module('studyAgendaApp')
  .controller('createTaskModalCtrl', function($scope, $modalInstance, Task, Student, TASK_MODIFICATION_TYPES, TASK_PRIVACY_TYPES, ngNotify, courseName, courseId) {
    $scope.courseName = courseName;
    $scope.newTask = new Task();
    $scope.newTask.course = courseId;
    // $scope.newTask.dueDate = new Date();
    $scope.dateChosen = false;

    if (!courseId) {
      var getCourses = function() {
        new Student().$getCoursesTasks({id: 'me'})
        .then(function(student) {
          $scope.student = student;

          var courses = student.enrollments[0].courses;
          var modifiedTasks = student.modifiedTasks;

          var tasksToAddToCourses = _.filter(modifiedTasks, { 'modificationType': TASK_MODIFICATION_TYPES.APPLY });

          _.each(courses, function(course) {
            course.tasks = _.filter(course.tasks, function(task) {
              var modifiedTask = _.findWhere(modifiedTasks, function(modifiedTask) {
                return modifiedTask.task && modifiedTask.task._id === task._id;
              });

              if (modifiedTask) {
                if (modifiedTask.modificationType === TASK_MODIFICATION_TYPES.NOT_APPLY) {

                  return false;
                } else if (modifiedTask.modificationType === TASK_MODIFICATION_TYPES.COMPLETED) {
                  task.completed = true;

                  return true;
                }
              } else if (task.privacyType === TASK_PRIVACY_TYPES.PUBLIC) {
                return true;
              } else {
                return false;
              }
            });

            if (tasksToAddToCourses) {
              _.each(tasksToAddToCourses, function(taskToAddToCourse) {
                if (taskToAddToCourse.task && taskToAddToCourse.task.course === course._id) {
                  course.tasks.push(taskToAddToCourse.task);
                }
              });
            }
          });

          $scope.courses = _.map(courses, function(course) {
            return {
              code: course.code,
              _id: course._id
            };
          });
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add pop-up to show error
        });
      };

      getCourses();
    }

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

    $scope.addTask = function() {
      if ($scope.addTaskForm.$valid) {
        $scope.newTask.$save()
        .then( function(task) {
          ngNotify.config({
            position: 'top',
            type: 'success',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('Task successfully created');

          $modalInstance.close();
          task.dueDate = new Date(task.dueDate);
        })
        .catch(function(err) {
          ngNotify.config({
            position: 'top',
            type: 'error',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('The system was not able to save the task');
        });
      }
    };

    $scope.$watch('newTask.course', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!$scope.courseChosen) {
          $scope.courseChosen = true;
        }
      }
    });

    $scope.$watch('newTask.dueDate', function(newValue, oldValue) {
      if (newValue !== oldValue) {
        console.log(newValue + ' !== ' + oldValue);
        $scope.newTask.$findByCourseDate()
        .then(function(task) {
          console.log('11111111');
          console.log($scope.newTask);

          $scope.dateChosen = true;
        })
        .catch(function(err) {
        });
      }
    });
  });
