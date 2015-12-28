'use strict';

angular.module('studyAgendaApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser({
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: $scope.user.email,
          password: $scope.user.password,
          password_confirm: $scope.user.password_confirm
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/inactive-user');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
            // assign custom change to the fields with errors
            // in order to unset validity and allow for resubmission
            $scope.form[field].change = function(){
              $scope.form[field].$setValidity('mongoose',true);
            }
          });
        });
      }
    };
  });
