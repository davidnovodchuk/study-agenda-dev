'use strict';

angular.module('studyAgendaApp')
  .factory('Course', function ($resource) {
    return $resource('/api/courses/:id/:controller', { id: '@_id' }, {
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
