'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageSchoolsCtrl', function ($scope, $state, School) {
    $scope.newSchool = new School();    

    var getSchools = function() {
      // Use the School $resource to fetch all schools from db
      $scope.schools = School.query();
    };

    getSchools();

    $scope.columns = [
      {
        columnName: 'Name',
        propertyName: 'name'
      }
    ];

    $scope.rowLinkFun = function(item){
      $state.go('admin.manage-schools-view-school', {schoolId: item._id});
    };

    $scope.addSchool = function() {
      if ($scope.addSchoolForm.$valid) {
        // saving school in the db
        $scope.newSchool.$save()
        .then( function(school) {
          // school successfully added
          // repapulating the schools
          getSchools();
          // initializing the add school form
          $scope.newSchool = new School();    
          $scope.addSchoolForm.$setPristine();
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add use pop-up to show error
          console.log(err.message);
        });
      }
    };

    $scope.cancelAddSchoolForm = function() {
      $scope.newSchool = new School();    
      $scope.addSchoolForm.$setPristine();    
    };
  });
