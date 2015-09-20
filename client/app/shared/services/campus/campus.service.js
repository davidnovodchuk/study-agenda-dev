'use strict';

angular.module('studyAgendaApp')
  .factory('Campus', function ($resource) {
    return $resource('/api/campuses/:id', { id: '@_id' }, {
      update: {
        method: 'PUT'
      }
    });
  });
