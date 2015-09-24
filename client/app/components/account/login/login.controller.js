'use strict';

angular.module('studyAgendaApp')
.controller('LoginCtrl', function ($scope, $state, Auth) {
  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form) {
    $scope.submitted = true;

    if(form.$valid) {
      Auth.login({
        email: $scope.user.email,
        password: $scope.user.password
      })
      .then( function() {
        // Reload state
        $state.reload();
      })
      .catch( function(err) {
        $scope.errors.other = err.message || 'Server Request Error';
      });
    } else {
      // set as dirty if the user click directly to login so we show the validation messages
      /*jshint -W106*/
      form.account_email.$dirty = true;
      form.account_password.$dirty = true;
    }
  };
  // CODE TAKEN FROM ANGLE THEME:
  // var vm = this;

  // activate();

  ////////////////

  // function activate() {
  //   // bind here all data from the form
  //   vm.account = {};
  //   // place the message if something goes wrong
  //   vm.authMsg = '';

  //   vm.login = function() {
  //     vm.authMsg = '';

  //     if(vm.loginForm.$valid) {

  //       $http
  //         .post('api/account/login', {email: vm.account.email, password: vm.account.password})
  //         .then(function(response) {
  //           // assumes if ok, response is an object with some data, if not, a string with error
  //           // customize according to your api
  //           if ( !response.account ) {
  //             vm.authMsg = 'Incorrect credentials.';
  //           }else{
  //             $state.go('app.dashboard');
  //           }
  //         }, function() {
  //           vm.authMsg = 'Server Request Error';
  //         });
  //     }
  //     else {
  //       // set as dirty if the user click directly to login so we show the validation messages
  //       /*jshint -W106*/
  //       vm.loginForm.account_email.$dirty = true;
  //       vm.loginForm.account_password.$dirty = true;
  //     }
  //   };
  // }
});
