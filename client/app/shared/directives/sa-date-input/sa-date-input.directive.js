'use strict';

angular.module('sa-date-input', [])

.directive('saDateInput', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-date-input/sa-date-input.html',
    scope: {
      // required attributes
      saDateInput: '@',
      // optional attribute
      fieldName: '=?'
    },
    link: function(scope){
      scope.data = {
        dateModel: new Date(scope.saDateInput)
      };

      scope.isDateInputTypeCompatible = function() {
        var input = document.createElement('input');
        input.setAttribute('type','date');

        var notADateValue = 'not-a-date';
        input.setAttribute('value', notADateValue); 

        if (input.value === notADateValue) {
          return false;
        }

        return true;
      };
    }
  };
});