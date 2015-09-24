'use strict';

angular.module('sa-delete-confirmation', [])

.directive('saDeleteConfirmation', function(ngDialog) {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-delete-confirmation/sa-delete-confirmation.html',
    scope: {
      // requires attributes:
      deleteButtonText: '=',
      deleteFunction: '=',
      deleteItemName: '=',
      // optional attribute:
      additionalText: '=?'
    },
    link: function(scope){
      scope.confirmDelete = function() {
        ngDialog.openConfirm({
          templateUrl: 'app/shared/directives/sa-delete-confirmation/delete-confirmation-dialog.html',
          className: 'ngdialog-theme-default',
          scope: scope
        }).then(function () {
          scope.deleteFunction();
        });
      };
    }
  };
});