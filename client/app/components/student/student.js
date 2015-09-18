'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider, USER_ROLES) {
    $stateProvider
    	.state('student', {
		    url: '/',
        templateUrl: 'app/app.html',
		    controller: ['$location', '$state', function($location, $state) {
          if ($location.path() === '/') {
          $state.go('student.dashboard');
          }
		    }],
		    authenticate: true,
        hasRole: USER_ROLES.STUDENT
		  })
      .state('student.dashboard', {
        url: 'dashboard',
        templateUrl: 'app/components/student/dashboard/dashboard.html',
        controller: 'StudentDashboardCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      })
      .state('student.change-password', {
        url: 'change-password',
        templateUrl: 'app/shared/templates/change-password/change-password.html',
        controller: 'ChangePasswordCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      });
  });