'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageUsersViewUserCtrl', function ($scope, $state, User, Auth, USER_ROLES) {
    var getUser = function() {
      new User().$get({id: $state.params.userId}, function(user) {
        $scope.user = user;
        $scope.availableRoles = USER_ROLES;
        $scope.isCurrentUser = Auth.getCurrentUser()._id.toString() === user._id.toString();
      });
    };

  	$scope.updateUser = function() {
      if ($scope.form.$valid) {
        $scope.user.$update()
        .then(function(user) {
          // success:
          $scope.form.$setPristine();
        })
        .catch(function(err) {
          // on error showing error
          // TODO: Add pop-up to show error
          console.log(err.message);
        });
      }
    };

    $scope.cancelForm = function() {
      getUser();
      $scope.form.$setPristine();
    };

    getUser();
  });
