'use strict';

angular.module('studyAgendaApp')
  .controller('PasswordResetCtrl', function ($rootScope, $scope, $state, User, ngNotify) {
    new User().$getPasswordResetInfo({controllerId: $state.params.passwordResetId})
    .then(function(user) {
      $scope.user = user;
    })
    .catch(function(err) {
      var errorMessage = err.message || 'The password reset link has expired. Get a new link';

      ngNotify.config({
        position: 'top',
        type: 'error',
        button: 'true',
        html: 'true'
      });
      ngNotify.set(errorMessage);

      $state.go('app');
    });

    $scope.resetPassword = function(form) {
      if(form.$valid) {
        $scope.user.$resetPassword()
        .then(function(res) {
          var successMessage = res.message || 'Your password was successfully reset';

          ngNotify.config({
            position: 'top',
            type: 'success',
            button: 'true',
            html: 'true'
          });
          ngNotify.set(successMessage);

          $state.go('app');
        })
        .catch(function(err) {
          var errorMessage = err.message || 'The system could not reset the password';

          ngNotify.config({
            position: 'top',
            type: 'error',
            button: 'true',
            html: 'true'
          });
          ngNotify.set(errorMessage);

          $state.go('app');
        });
      }
    };
  });
