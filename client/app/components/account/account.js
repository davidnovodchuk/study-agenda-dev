'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account', {
        // url: '/account',
        templateUrl: 'app/components/account/account.html',
        controller: ['$rootScope', '$state', function($rootScope, $state) {
          $rootScope.app.layout.isBoxed = false;

          if($rootScope.user) {
            $state.go('app');
          }
        }]
      })
      .state('account.login', {
        url: '/login',
        templateUrl: 'app/components/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('account.signup', {
        url: '/signup',
        templateUrl: 'app/components/account/signup/signup.html',
        controller: 'SignupCtrl',
      });
  });