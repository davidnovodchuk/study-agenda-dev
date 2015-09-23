'use strict';

angular.module('studyAgendaApp')
  .controller('AdminManageUsersCtrl', function ($scope, $state, Auth, User) {
    // Use the User $resource to fetch all users
    $scope.data = User.query();

    $scope.columns = [
      {
        columnName: 'Name',
        propertyName: 'name'
      },
      {
        columnName: 'Email',
        propertyName: 'email'
      }
    ];

    $scope.rowLinkFun = function(item){
      $state.go('admin.manage-users-view-user', { userId: item._id });
    };
  });
