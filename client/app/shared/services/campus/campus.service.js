'use strict';

angular.module('studyAgendaApp')
  .factory('Campus', function ($resource) {
    return $resource('/api/campuses/:id/:controller', { id: '@_id' }, {
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
