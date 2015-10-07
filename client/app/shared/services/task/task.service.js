'use strict';

angular.module('studyAgendaApp')
  .factory('Task', function ($resource) {
    return $resource('/api/tasks/:id/:controller', { id: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getWithPopulatedReferences: {
        method: 'GET',
        params: {
          controller:'with-references'
        }
      }
    });
  });
