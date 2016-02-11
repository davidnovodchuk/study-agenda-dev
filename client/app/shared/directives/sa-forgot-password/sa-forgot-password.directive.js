'use strict';

angular.module('sa-forgot-password', [])

.directive('saForgotPassword', function($modal, User, ngNotify) {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-forgot-password/sa-forgot-password.html',
    link: function(scope) {
      scope.openForgotPasswordModal = function() {
        var forgotPasswordModal = $modal.open({
          templateUrl: 'app/shared/directives/sa-forgot-password/sa-forgot-password-modal.html',
          animation: true,
          size: 'sm',
          scope: scope,
          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.cancel = function() {
              $modalInstance.dismiss();
            };

            $scope.sendEmail = function() {
              $modalInstance.close($scope.email);
            };
          }]
        });

        forgotPasswordModal.result
        .then(function (emailAddress) {
          new User().$sendForgotPasswordEmail({controllerId: emailAddress})
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
            var errorMessage = err.data || 'The system could not send the password reset email. Please try again';

            ngNotify.config({
              position: 'top',
              type: 'error',
              button: 'true',
              html: 'true'
            });
            ngNotify.set(errorMessage);
          });
        }, function () {
          // NOTE: code here is executed when modal is cancelled
        });
      };
    }
  };
});
