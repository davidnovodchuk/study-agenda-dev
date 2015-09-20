'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider, USER_ROLES) {
    $stateProvider
    	.state('admin.manage-users-view-user', {
        url: 'manage-users/user/:userId',
        templateUrl: 'app/components/admin/manage-users/view-user/view-user.html',
        controller: 'AdminManageUsersViewUserCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN
      });
  });