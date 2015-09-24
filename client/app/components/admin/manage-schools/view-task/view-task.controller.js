'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageSchoolsViewTaskCtrl', function ($scope, $state, $filter, Task) {
    var getTask = function() {
      new Task().$getWithPopulatedReferences({id: $state.params.taskId})
      .then(function(task) {
        $scope.task = task;
        $scope.task.dueDate = new Date(task.dueDate);

        $scope.course = task.course;
        delete $scope.task.course;
      })
      .catch(function(err) {
        // TODO: show error
      });
    };

    getTask();

    $scope.updateEditMode = function(newValue) {
      $scope.editMode = newValue;
    };

  	$scope.updateTask = function() {
      if ($scope.form.$valid) {
        $scope.task.$update()
        .then(function(task) {
          // success:
          // TODO: Add success pop-up
          $scope.task.dueDate = new Date(task.dueDate);
          $scope.updateEditMode(false);
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add pop-up to show error
          console.log(err);
        });
      }
    };

    $scope.cancelForm = function() {
      getTask();
      $scope.updateEditMode(false);
    };

    $scope.deleteTask = function() {
      // saving task in the db
      $scope.task.$delete()
      .then( function() {
        // task successfully deleted
        $state.go('admin.manage-schools-view-course', {courseId: $scope.course._id});
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add use pop-up to show error
        console.log(err);
      });
    };
  });
