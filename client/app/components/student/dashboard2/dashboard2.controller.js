'use strict';

angular.module('studyAgendaApp')
  .controller('StudentDashboardCtrl2', function ($scope, $state, Auth) {

    $scope.logout = function() {
      Auth.logout();
      $state.go('account.login');
    };
$scope.testFunciton = function(){
  console.log("Test!!");
}
    $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
     $scope.series = ['Series A', 'Series B'];

     $scope.data = [
       [65, 59, 80, 81, 56, 55, 40],
       [28, 48, 40, 19, 86, 27, 90]
     ];
  });
