'use strict';

angular.module('studyAgendaApp')
  .controller('StudentEditTaskCtrl', function ($scope, $modalInstance, $modal, 
    TASK_MODIFICATION_TYPES, Task, student, course, task) {
    $scope.course = course;
  	$scope.task = new Task(task);
    $scope.task.dueDate = new Date($scope.task.dueDate);

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  	$scope.editTask = function() {
      if ($scope.editTaskForm.$valid) {
        $scope.task.$studentUpdate({controllerId: 'me'})
        .then(function(task) {
          $modalInstance.close();
          task.dueDate = new Date(task.dueDate);
        })
        .catch(function(err) {
          // TODO: Add use pop-up to show error
          $scope.serverError = 'The system was not able to update the task';
        });
      }
    };
  });
