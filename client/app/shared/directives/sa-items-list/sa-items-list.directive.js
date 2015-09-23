'use strict';

angular.module('sa-items-list', [])

.directive('saItemsList', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-items-list/sa-items-list.html',
    scope: {
      // required attributes
      saItemsList: '=',
      columns: '=',
      searchPlaceholder: '=',
      // optional attribute
      rowLinkFun: '=?'
    },
    link: function(scope){
      scope.sortType     = scope.columns[0].propertyName; // set the default sort type
      scope.sortReverse  = false;  // set the default sort order
      scope.searchQuery   = '';     // set the default search/filter term

      scope.changeSort = function(propertyName){
        scope.sortType = propertyName; 
        scope.sortReverse = !scope.sortReverse;
      };
    }
  };
});