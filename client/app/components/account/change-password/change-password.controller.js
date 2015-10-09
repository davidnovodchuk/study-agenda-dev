'use strict';

angular.module('studyAgendaApp')
  .controller('ChangePasswordCtrl', function ($scope, $modalInstance,User, Auth) {
    $scope.errors = {};

    $scope.cancel = function(){
      $modalInstance.dismiss();
    };

    $scope.changePassword = function() {
      $scope.submitted = true;
      if($scope.changePass.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          //$scope.user = user;
          
          $scope.message = 'Password successfully changed';

          $scope.changePass.$setPristine();
          
          $modalInstance.close();
        })
        .catch( function(err) {
          $scope.changePass.oldPassword.$setValidity('mongoose', false);
          $scope.errors.oldPassword = 'Incorrect current password';
          $scope.message = '';
          // assign custom change to the fields with errors 
          // in order to unset validity and allow for resubmission
          $scope.changePass.oldPassword.change = function(){
            $scope.changePass.oldPassword.$setValidity('mongoose',true);
          }
        });
      }
    }
  });
