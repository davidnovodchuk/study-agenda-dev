'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider, USER_ROLES) {
    $stateProvider
    	.state('admin', {
		    url: '/admin',
		    authenticate: true,
        hasRole: USER_ROLES.ADMIN,
        templateUrl: 'app/app.html',
		    controller: ['$location', '$state', function($location, $state) {
          if ($location.path() === '/admin') {
            $state.go('admin.dashboard');
          }
		    }]
		  })
      .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/components/admin/dashboard/dashboard.html',
        controller: 'AdminDashboardCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN,
      })
      .state('admin.manage-schools', {
        url: '/manage-schools',
        templateUrl: 'app/components/admin/manage-schools/manage-schools.html',
        controller: 'AdminManageSchoolsCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN,
      })
      .state('admin.manage-users', {
        url: '/manage-users',
        templateUrl: 'app/components/admin/manage-users/manage-users.html',
        controller: 'AdminManageUsersCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN,
      })
      .state('admin.change-password', {
        url: '/change-password',
        templateUrl: 'app/shared/templates/change-password/change-password.html',
        controller: 'ChangePasswordCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN,
      });
  });