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
        templateUrl: 'app/components/account/change-password/change-password.html',
        controller: 'ChangePasswordCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      })
      .state('student.availability', {
        url: 'availability',
        templateUrl: 'app/components/student/availability/availability.html',
        controller: 'StudentAvailabilityCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      })
      .state('student.agenda', {
        url: 'agenda',
        templateUrl: 'app/components/student/agenda/agenda.html',
        controller: 'StudentAgendaCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      })
      .state('student.enrolments', {
        url: 'enrolments',
        templateUrl: 'app/components/student/enrolments/enrolments.html',
        controller: 'StudentEnrolmentsCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      })
      .state('student.courses-tasks', {
        url: 'courses-tasks',
        templateUrl: 'app/components/student/courses-tasks/courses-tasks.html',
        controller: 'StudentCoursesTasksCtrl',
        authenticate: true,
        hasRole: USER_ROLES.STUDENT,
      });
  });