'use strict';

angular.module('studyAgendaApp')
  .controller('StudentAvailabilityCtrl', function ($scope, Auth, User, SweetAlert) {
    var student;

    function getStudent() {
      new User().$get()
      .then(function(user) {
        student = user;
        $scope.studyDays = user.studyDays;

        _.each($scope.studyDays, function(studyDay) {
          studyDay.hours = studyDay.minutes / 60;
        });
      })
      .catch(function(err) {
        // TODO: show error
      });
    };

    getStudent();

    $scope.slider =
    {
      min: 0,
      max : 12,
      step: 0.5,
      tooltipsplit: false,
      tooltipseparator: ':'
    };

    $scope.cancelHours = function() {
      getStudent();
      $scope.form.$setPristine();
    };

    $scope.saveHours = function() {
      _.each($scope.studyDays, function(studyDay) {
        studyDay.minutes = studyDay.hours * 60;
      });
      student.studyDays = $scope.studyDays;

      student.$update()
      .then(function(user) {
        student = user;
        $scope.form.$setPristine();

        if (isTotalZero()) {
          $scope.zeroHoursAlert()
        }
      })
      .catch(function(err) {

        // TODO: show error
      });
    };

    var isTotalZero = function(){
      var total = 0;
      if(student) {
        _.each($scope.studyDays, function(studyDay) {
          total += studyDay.minutes;
        });
        return (total === 0) ? true : false;
      }
    };

    $scope.zeroHoursAlert = function() {
      SweetAlert.swal({
        title: 'You have total 0 hours',
        text: 'Schedule cannot be calculated',
        type: 'warning',
        showCancelButton: false,
        confirmButtonColor: 'green',
        confirmButtonText: 'Yes, I got it!',
        closeOnConfirm: false
      });
    };
});
