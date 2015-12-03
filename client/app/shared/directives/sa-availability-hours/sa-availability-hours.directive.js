'use strict';

angular.module('sa-availability-hours', [])

.directive('saAvailabilityHours', function(User, SweetAlert, ngNotify) {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-availability-hours/sa-availability-hours.html',
    scope: {
      callOnSave: '=?'
    },
    link: function($scope){
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
          ngNotify.config({
            position: 'top',
            type: 'success',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('Availability hours successfully updated');

          student = user;
          $scope.form.$setPristine();

          if (isTotalZero()) {
            $scope.zeroHoursAlert()
          }

          $scope.callOnSave && $scope.callOnSave();
        })
        .catch(function(err) {
          ngNotify.config({
            position: 'top',
            type: 'error',
            button: 'true',
            html: 'true'
          });
          ngNotify.set('The system was not able to save your availability hours');
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
    }
  };
});
