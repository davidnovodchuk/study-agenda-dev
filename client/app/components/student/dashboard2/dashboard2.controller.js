'use strict';

angular.module('studyAgendaApp')
  .controller('StudentDashboardCtrl2', function ($scope, $state, Auth) {

    $scope.logout = function() {
      Auth.logout();
      $state.go('account.login');
    };
  });
