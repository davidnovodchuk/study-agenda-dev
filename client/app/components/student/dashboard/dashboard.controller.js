'use strict';

angular.module('studyAgendaApp')
  .controller('StudentDashboardCtrl', function ($scope, $state, Auth) {

    $scope.logout = function() {
      Auth.logout();
      $state.go('account.login');
    };
  });
