'use strict';

angular.module('studyAgendaApp')
  .factory('Student', function ($resource) {
    return $resource('/api/students/:id/:controller', {
      id: '@_id'
    },
    {
      getCoursesTasks: {
        method: 'GET',
        params: {
          controller:'courses-tasks'
        }
      },
      addTaskModification: {
        method: 'PUT',
        params: {
          controller:'add-task-modification'
        }
      },
      getEnrollments: {
        method: 'GET',
        params: {
          controller:'enrollments'
        }
      },
      getSchedule: {
        method: 'GET',
        params: {
          controller:'dashboard'
        }
      }
    });
  });
