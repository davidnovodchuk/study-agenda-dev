'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageSchoolsViewSchoolCtrl', function ($scope, $state, School, Campus) {
    var initializeCampus = function() {
      $scope.newCampus = new Campus();
      $scope.newCampus.school = $state.params.schoolId;
    };

    var getSchool = function() {
      new School().$getWithPopulatedReferences({id: $state.params.schoolId})
      .then(function(school) {
        $scope.school = school;
        $scope.campuses = school.campuses;
        delete $scope.school.campuses;
      })
      .catch(function(err) {
        // TODO: show error
      });
    };

    initializeCampus();
    getSchool();

    $scope.columns = [
      {
        columnName: 'Name',
        propertyName: 'name'
      }
    ];

    $scope.rowLinkFun = function(item){
      // TODO: implement manage-schools-view-campus state
      $state.go('admin.manage-schools-view-campus', {campusId: item._id});
    };

    $scope.updateEditMode = function(newValue) {
      $scope.editMode = newValue;
    };

  	$scope.updateSchool = function() {
      if ($scope.form.$valid) {
        $scope.school.$update()
        .then(function(school) {
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
      getSchool();
      $scope.updateEditMode(false);
    };

    $scope.addCampus = function() {
      if ($scope.addCampusForm.$valid) {
        // saving school in the db
        $scope.newCampus.$save()
        .then( function(campus) {
          // campus successfully added
          // repapulating the school (with the new campus)
          getSchool();
          // initializing the add campus form
          initializeCampus();
          $scope.addCampusForm.$setPristine();
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add use pop-up to show error
          console.log(err);
        });
      }
    };

    $scope.deleteSchool = function() {
      // saving school in the db
      $scope.school.$delete()
      .then( function() {
        // school successfully deleted
        $state.go('admin.manage-schools');
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add use pop-up to show error
        console.log(err);
      });
    };

    $scope.cancelAddCampusForm = function() {
      initializeCampus();
      $scope.addCampusForm.$setPristine();
    };
  });
