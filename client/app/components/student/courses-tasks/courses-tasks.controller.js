'use strict';

angular.module('studyAgendaApp')
  .controller('StudentCoursesTasksCtrl', function ($scope, $modal, TASK_MODIFICATION_TYPES,
    TASK_PRIVACY_TYPES, Student) {
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

        $scope.courses = courses;
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add pop-up to show error
        console.log(err);
      });
    };

    getCourses();

    $scope.addTaskToCourse = function(courseId, courseName) {
      var addTaskToCourseModal = $modal.open({
        templateUrl: 'app/shared/templates/create-task/create-task.html',
        controller: 'createTaskModalCtrl',
        resolve: {
          courseId: function() {
            return courseId;
          },
          courseName: function() {
            return courseName;
          }
        }
      });

      addTaskToCourseModal.result
      .then(function () {
        getCourses();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

    $scope.editTask = function (course, task) {
      var editTaskModal = $modal.open({
        templateUrl: 'app/shared/templates/student-manage-task/student-manage-task.html',
        controller: 'StudentManageTaskCtrl',
        resolve: {
          student: function() {
            return $scope.student;
          },
          course: function() {
            return course;
          },
          task: function() {
            return task;
          },
          accomplishToday: function() {
            return null;
          }
        }
      });

      editTaskModal.result
      .then(function () {
        getCourses();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };
  });

angular.module('studyAgendaApp')
.controller('ModalInstanceCtrl', function ($scope, Task, courseName) {
  $scope.courseName = courseName;
  $scope.newTask = new Task();
  $scope.newTask.course = courseId;
  $scope.newTask.dueDate = new Date();

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

  $scope.addTask = function() {
    if ($scope.addTaskForm.$valid) {
      $scope.newTask.$save()
      .then( function(task) {
        $scope.closeThisDialog();
        getCourses();
      })
      .catch(function(err) {
        // TODO: Add use pop-up to show error
        $scope.serverError = 'The system was not able to save the task';
      });
    }
  };
});
