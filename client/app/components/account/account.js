'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('account', {
        // url: '/account',
        templateUrl: 'app/components/account/account.html',
        controller: ['$rootScope', '$state', function($rootScope, $state) {
          $rootScope.app.layout.isBoxed = false;

          if($rootScope.user && $rootScope.user.isActive) {
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
      })
      .state('account.activation', {
        isActivationState: true,
        url: '/activate/:activationKey',
        // templateUrl: 'app/components/account/account.html',
        controller: ['$state', '$location', 'User', 'ngNotify', function($state, $location, User, ngNotify) {
          new User().$activate({controllerId: $state.params.activationKey})
          .then(function(res) {
            ngNotify.config({
              position: 'top',
              type: 'success',
              button: 'true',
              html: 'true'
            });
            ngNotify.set(res.message);

            $location.path('/');
          })
          .catch(function(err) {
            ngNotify.config({
              position: 'top',
              type: 'error',
              button: 'true',
              html: 'true'
            });
            ngNotify.set('Account wasn\'t activated');
          });
        }]
      })
      .state('account.inactive-user', {
        url: '/inactive-user',
        templateUrl: 'app/components/account/inactive-user/inactive-user.html',
        controller: 'InactiveUserCtrl',
        authenticate: true
      })
      .state('account.password-reset', {
        url: '/password-reset/:passwordResetId',
        templateUrl: 'app/components/account/password-reset/password-reset.html',
        controller: 'PasswordResetCtrl'
      });
  });
