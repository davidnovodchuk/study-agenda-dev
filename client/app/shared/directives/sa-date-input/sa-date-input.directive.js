'use strict';

angular.module('sa-date-input', [])

.directive('saDateInput', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-date-input/sa-date-input.html',
    replace: true,
    // transclude: true,
    require: '?ngModel',
    scope: {
      // optional attribute
      fieldName: '=?'
    },
    link: function(scope, element, attrs, ngModelDate){
      if (!ngModelDate) {
        return;
      }

      scope.data = {};

      scope.onChange = function(){
        ngModelDate.$setViewValue(scope.data.saDateInput);
      };

      ngModelDate.$render = function(){
        scope.data.saDateInput = new Date(ngModelDate.$modelValue);
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