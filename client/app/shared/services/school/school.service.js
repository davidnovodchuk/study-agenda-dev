'use strict';

angular.module('studyAgendaApp')
  .factory('School', function ($resource) {
    return $resource('/api/schools/:id/:controller', { id: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getWithPopulatedCampuses: {
        method: 'GET',
        params: {
          controller:'with-campuses'
        }
      }
    });
  });
