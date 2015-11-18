'use strict';

angular.module('studyAgendaApp')
  .controller('StudentManageTaskCtrl', function ($scope, $modalInstance, $modal, 
    TASK_MODIFICATION_TYPES, Task, student, course, task) {
    $scope.course = course;
  	$scope.task = new Task(task);
    $scope.task.dueDate = new Date($scope.task.dueDate);

    var addTaskModification = function() {
      student.$addTaskModification({id: 'me'})
      .then(function(student) {
        $modalInstance.close(TASK_MODIFICATION_TYPES.COMPLETED);
      })
      .catch(function(err) {
        // TODO: Add use pop-up to show error
        $scope.serverError = 'The system was not able to update the task';
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss();
    };

  	$scope.editTask = function() {
      var editTaskModal = $modal.open({
        templateUrl: 'app/shared/templates/student-edit-task/student-edit-task.html', 
        controller: 'StudentEditTaskCtrl',
        animation: true,
        resolve: {
          student: function() {
            return $scope.student;
          },
          course: function() {
            return course;
          },
          task: function() {
            return task;
          }
        }
      });

      editTaskModal.result
      .then(function () {
        student.newTaskModification = {
          task: task._id,
          modificationType: TASK_MODIFICATION_TYPES.NOT_APPLY
        };
        addTaskModification();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

   	$scope.markTaskCompleted = function() {
      student.newTaskModification = {
        task: task._id,
        modificationType: TASK_MODIFICATION_TYPES.COMPLETED
      };
      addTaskModification();
    };

   	$scope.unmarkTaskCompleted = function() {
      student.newTaskModification = {
        task: task._id,
        modificationType: TASK_MODIFICATION_TYPES.APPLY
      };
      addTaskModification();
    };

		$scope.removeTask = function() {
      $scope.deleteItemName = $scope.task.name;
      $scope.deleteItemType = 'task';
      $scope.additionalText = 'Note: the task will be permanently removed from your tasks!';

      var confirmDeleteModal = $modal.open({
        templateUrl: 'app/shared/directives/sa-delete-confirmation/delete-confirmation-dialog.html',
        animation: true,
        size: 'sm',
        scope: $scope,
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
          $scope.cancel = function() {
            $modalInstance.dismiss();
          };

          $scope.confirm = function() {
            $modalInstance.close();
          };
        }]
      });

      confirmDeleteModal.result
      .then(function () {
        student.newTaskModification = {
          task: task._id,
          modificationType: TASK_MODIFICATION_TYPES.NOT_APPLY
        };
        addTaskModification();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };
  });
