'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageSchoolsViewCourseCtrl', function ($scope, $state, $filter, Course, Task) {
    var initializeTask = function() {
      $scope.newTask = new Task();
      $scope.newTask.course = $state.params.courseId;
    };

    var getCourse = function() {
      new Course().$getWithPopulatedReferences({id: $state.params.courseId})
      .then(function(course) {
        $scope.course = course;

        $scope.campus = course.campus;
        delete $scope.course.campus;
        
        $scope.tasks = course.tasks;
        delete $scope.course.tasks;
      })
      .catch(function(err) {
        // TODO: show error
      });
    };

    initializeTask();
    getCourse();

    $scope.columns = [
      {
        columnName: 'Name',
        propertyName: 'name'
      },
      {
        columnName: 'Weight',
        propertyName: 'weight'
      },
      {
        columnName: 'Due Date',
        propertyName: 'dueDate',
        isDate: true
      }
    ];

    $scope.rowLinkFun = function(item){
      $state.go('admin.manage-schools-view-task', {taskId: item._id});
    };

    $scope.updateEditMode = function(newValue) {
      $scope.editMode = newValue;
    };

  	$scope.updateCourse = function() {
      if ($scope.form.$valid) {
        $scope.course.$update()
        .then(function(course) {
          // success:
          // TODO: Add success pop-up
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
      getCourse();
      $scope.updateEditMode(false);
    };

    $scope.addTask = function() {
      if ($scope.addTaskForm.$valid) {
        // saving course in the db
        $scope.newTask.$save()
        .then( function(task) {
          // task successfully added
          // repapulating the course (with the new task)
          getCourse();
          // initializing the add task form
          initializeTask();
          $scope.addTaskForm.$setPristine();
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add use pop-up to show error
          console.log(err);
        });
      }
    };

    $scope.deleteCourse = function() {
      // saving course in the db
      $scope.course.$delete()
      .then( function() {
        // course successfully deleted
        $state.go('admin.manage-schools-view-campus', {campusId: $scope.campus._id});
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add use pop-up to show error
        console.log(err);
      });
    };

    $scope.cancelAddTaskForm = function() {
      initializeTask();
      $scope.addTaskForm.$setPristine();
    };
  });
