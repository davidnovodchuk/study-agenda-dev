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
      })
      .state('admin.manage-schools-view-campus', {
        url: 'manage-schools/campus/:campusId',
        templateUrl: 'app/components/admin/manage-schools/view-campus/view-campus.html',
        controller: 'AdminManageSchoolsViewCampusCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN
      })
      .state('admin.manage-schools-view-course', {
        url: 'manage-schools/course/:courseId',
        templateUrl: 'app/components/admin/manage-schools/view-course/view-course.html',
        controller: 'AdminManageSchoolsViewCourseCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN
      })
      .state('admin.manage-schools-view-task', {
        url: 'manage-schools/task/:taskId',
        templateUrl: 'app/components/admin/manage-schools/view-task/view-task.html',
        controller: 'AdminManageSchoolsViewTaskCtrl',
        authenticate: true,
        hasRole: USER_ROLES.ADMIN
      });
  });