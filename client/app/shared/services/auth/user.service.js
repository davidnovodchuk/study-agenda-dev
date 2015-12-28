'use strict';

angular.module('studyAgendaApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller/:controllerId', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      update: {
        method: 'PUT'
      },
      activate: {
        method: 'GET',
        params: {
          controller:'activate'
        }
      },
      reSendActivation: {
        method: 'GET',
        params: {
          controller:'re-send-activation'
        }
      },
      sendForgotPasswordEmail: {
        method: 'GET',
        params: {
          controller:'send-forgot-password-email'
        }
      },
      getPasswordResetInfo: {
        method: 'GET',
        params: {
          controller:'get-password-reset-info'
        }
      },
      resetPassword: {
        method: 'PUT',
        params: {
          controller:'reset-password'
        }
      }
	  });
  });
