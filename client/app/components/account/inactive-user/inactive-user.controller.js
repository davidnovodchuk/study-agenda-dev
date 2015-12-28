'use strict';

angular.module('studyAgendaApp')
  .controller('InactiveUserCtrl', function ($rootScope, $scope, $state, User, ngNotify) {
    new User().$get()
    .then(function(user) {
      if (user.isActivated) {
        $rootScope.user = user;
        $state.go('app');
      }
    });

    $scope.sendActivation = function() {
      new User().$reSendActivation({controllerId: true})
      .then(function(res) {
        ngNotify.config({
          position: 'top',
          type: 'success',
          button: 'true',
          html: 'true'
        });
        ngNotify.set(res.message);
      })
      .catch(function(err) {
        ngNotify.config({
          position: 'top',
          type: 'error',
          button: 'true',
          html: 'true'
        });
        ngNotify.set('System could not sent the activation email. Please try again');
      });
    };
  });
