'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageSchoolsViewCampusCtrl', function ($scope, $state, Campus, Course) {
    var initializeCourse = function() {
      $scope.newCourse = new Course();
      $scope.newCourse.campus = $state.params.campusId;
    };

    var getCampus = function() {
      new Campus().$getWithPopulatedReferences({id: $state.params.campusId})
      .then(function(campus) {
        $scope.campus = campus;
        $scope.school = campus.school;
        $scope.courses = campus.courses;
        delete $scope.campus.school;
        delete $scope.campus.courses;
      })
      .catch(function(err) {
        // TODO: show error
      });
    };

    initializeCourse();
    getCampus();

    $scope.columns = [
      {
        columnName: 'Code',
        propertyName: 'code'
      },
      {
        columnName: 'Title',
        propertyName: 'title'
      },
      {
        columnName: 'Section',
        propertyName: 'section'
      }
    ];

    $scope.rowLinkFun = function(item){
      $state.go('admin.manage-schools-view-course', {courseId: item._id});
    };

    $scope.updateEditMode = function(newValue) {
      $scope.editMode = newValue;
    };

  	$scope.updateCampus = function() {
      if ($scope.form.$valid) {
        $scope.campus.$update()
        .then(function(campus) {
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
      getCampus();
      $scope.updateEditMode(false);
    };

    $scope.addCourse = function() {
      if ($scope.addCourseForm.$valid) {
        // saving campus in the db
        $scope.newCourse.$save()
        .then( function(course) {
          // course successfully added
          // repapulating the campus (with the new course)
          getCampus();
          // initializing the add course form
          initializeCourse();
          $scope.addCourseForm.$setPristine();
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add use pop-up to show error
          console.log(err);
        });
      }
    };

    $scope.deleteCampus = function() {
      // saving campus in the db
      $scope.campus.$delete()
      .then( function() {
        // campus successfully deleted
      $state.go('admin.manage-schools-view-school', {schoolId: $scope.school._id});
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add use pop-up to show error
        console.log(err);
      });
    };

    $scope.cancelAddCourseForm = function() {
      initializeCourse();
      $scope.addCourseForm.$setPristine();
    };
  });
