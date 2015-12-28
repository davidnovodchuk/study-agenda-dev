'use strict';

angular.module('studyAgendaApp')
  .controller('StudentDashboardCtrl', function ($scope, $state, $stateParams, $anchorScroll, $modal, Student) {
    $scope.refreshPage = function() {
      $anchorScroll();
      $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
    };

    $scope.getStudent = function() {
      new Student().$getSchedule({id: 'me', today: new Date()})
      .then(function(student) {
        $scope.enrollments = student.enrollments;
        $scope.isTotalHoursZero = _.every(student.studyDays, function(studyDay) {
          return studyDay.minutes === 0;
        });

        if (!$scope.isTotalHoursZero) {
          var availabilityChartData = _.map(student.studyDays, function(studyDay) {
            return studyDay.minutes / 60;
          });

          $scope.data = [availabilityChartData];
        }

        $scope.daysWithTasksDue = [];

        _.each(student.schedule, function(scheduleItem) {
          if (scheduleItem._tasksDue.length) {
            $scope.daysWithTasksDue.push(scheduleItem);
          } else {
            $scope.accomplishToday = scheduleItem;
          }
        });

        $scope.student = student;
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add pop-up to show error
      });
    };

    $scope.getStudent();

    $scope.createTaskFunciton = function(){
      var addTaskToCourseModal = $modal.open({
        templateUrl: 'app/shared/templates/create-task/create-task.html',
        controller: 'createTaskModalCtrl',
        resolve: {
          courseId: function() {
            return null;
          },
          courseName: function() {
            return null;
          }
        }
      });

      addTaskToCourseModal.result
      .then(function () {
        $scope.getStudent();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

    $scope.infoModal = function(accomplishToday, isTaskCompleted){
      var course = {
        code: 'BTH740'
      };
      var task = {
        name: 'Final Report',
        weight: 10,
        dueDate: new Date(),
        completed: isTaskCompleted
      };

      var editTaskModal = $modal.open({
        templateUrl: 'app/shared/templates/student-manage-task/student-manage-task.html',
        controller: 'StudentManageTaskCtrl',
        resolve: {
          student: function() {
            return $scope.student;
          },
          course: function() {
            return course;
          },
          task: function() {
            return task;
          },
          accomplishToday: function() {
            return accomplishToday;
          }
        }
      });

      editTaskModal.result
      .then(function () {
        getCourses();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

    $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    $scope.series = ['Series A', 'Series B'];
  });
