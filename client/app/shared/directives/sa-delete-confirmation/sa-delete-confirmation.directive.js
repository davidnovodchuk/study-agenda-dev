'use strict';

angular.module('sa-delete-confirmation', [])

.directive('saDeleteConfirmation', function($modal) {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-delete-confirmation/sa-delete-confirmation.html',
    scope: {
      // requires attributes:
      deleteButtonText: '=',
      deleteFunction: '=',
      deleteItemName: '=',
      // optional attribute:
      additionalText: '=?',
      deleteItemType: '=?',
      deleteButtonClass: '=?'
    },
    link: function(scope) {
      scope.confirmDelete = function() {
        var confirmDeleteModal = $modal.open({
          templateUrl: 'app/shared/directives/sa-delete-confirmation/delete-confirmation-dialog.html',
          animation: true,
          size: 'sm',
          scope: scope,
          controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
            $scope.cancel = function() {
              $modalInstance.dismiss();
            };

            $scope.confirm = function() {
              $modalInstance.close();
            };
          }]
        });

        confirmDeleteModal.result
        .then(function () {
          scope.deleteFunction();
        }, function () {
          // NOTE: code here is executed when modal is cancelled
        });
      };
    }
  };
});