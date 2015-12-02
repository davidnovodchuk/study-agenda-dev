// Profile controller
'use strict';

angular.module('studyAgendaApp')
  .controller('ProfileCtrl', function ($scope, User, $modal, ngNotify, Auth, $state) {
    $scope.errors = {};

    $scope.updateProfile = function() {
      $scope.submitted = true;
      if($scope.form.$valid) {
        $scope.user.$update()
        .then( function() {
          ngNotify.config({
            position: 'top',
            type: 'success',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('Profile successfully updated');
          $scope.form.$setPristine();
        })
        .catch( function(err) {
          $scope.message = err;
          ngNotify.config({
            position: 'top',
            type: 'error',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('Profile wasn\'t updated. Try again.');
        });
      }
    };

    $scope.changePasswordModal = function(){
      var passwordModal = $modal.open({
        templateUrl: 'app/components/account/change-password/change-password.html',
        controller: 'ChangePasswordCtrl',
      });

      passwordModal.result
      .then(function () {
        //getCourses();
        ngNotify.config({
          position: 'top',
          type: 'success',
          button: 'true',
          html: 'true'
        });
        ngNotify.set('Password successfully changed');
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

    $scope.logout = function() {
      Auth.logout();
      $state.go('account.login');
    };

  });
