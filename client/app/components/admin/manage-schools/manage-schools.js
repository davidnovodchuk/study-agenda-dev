'use strict';

angular.module('studyAgendaApp')
  .config(function ($stateProvider, USER_ROLES) {
    $stateProvider
    	.state('admin.manage-schools-view-school', {
        url: 'manage-schools/school/:schoolId',
        templateUrl: 'app/components/admin/manage-schools/view-school/view-school.html',
        controller: 'AdminManageSchoolsViewSchoolCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN
      });
  });