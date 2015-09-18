'use strict';

angular.module('studyAgendaApp')
  .factory('Category', function ($resource) {
    return $resource('/api/categories/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  });
