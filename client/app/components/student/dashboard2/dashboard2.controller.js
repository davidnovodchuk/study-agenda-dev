'use strict';

angular.module('studyAgendaApp')
.controller('StudentDashboardCtrl2', function ($scope, $state, Auth) {

  $scope.logout = function() {
    Auth.logout();
    $state.go('account.login');
  };
  $scope.createTaskFunciton = function(){
    console.log('Create Task Modal!!');
  };

  $scope.infoModal = function(){
    console.log('ModalInfo!!');
  };
  $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
  $scope.series = ['Series A', 'Series B'];

  $scope.data = [
    [6, 1 , 9, 2, 0, 7, 2,6]
  ];
});
