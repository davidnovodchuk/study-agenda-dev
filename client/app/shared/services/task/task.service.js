'use strict';

angular.module('studyAgendaApp')
  .factory('Task', function ($resource) {
    return $resource('/api/tasks/:id/:controller/:controllerId', { id: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getWithPopulatedReferences: {
        method: 'GET',
        params: {
          controller:'with-references'
        }
      },
      studentUpdate: {
        method: 'POST',
        params: {
          controller:'student-update'
        }
      },
      findByCourseDate: {
        method: 'POST',
        params: {
          controller:'find-by-course-date'
        }
      }
    });
  });
