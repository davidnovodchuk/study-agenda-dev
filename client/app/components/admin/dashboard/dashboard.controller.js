'use strict';

angular.module('studyAgendaApp')
  .controller('AdminDashboardCtrl', function ($scope, $state, Auth, User) {
    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

    $scope.logout = function() {
      Auth.logout();
      $state.go('account.login');
    };
  });
