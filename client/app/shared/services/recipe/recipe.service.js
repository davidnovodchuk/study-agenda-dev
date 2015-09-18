'use strict';

angular.module('studyAgendaApp')
  .factory('Recipe', function ($resource) {
    return $resource('/api/recipes/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  });
