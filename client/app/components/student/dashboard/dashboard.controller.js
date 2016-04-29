'use strict';

angular.module('studyAgendaApp')
  .controller('StudentDashboardCtrl', function ($scope, $state, $stateParams, $anchorScroll, $modal, Student, TASK_MODIFICATION_TYPES,
    TASK_PRIVACY_TYPES) {
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
        console.log(student);
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
        $scope.comingUpTasks = [];
        console.log("********** schedule **********");
        console.log(student.schedule);
        console.log("**********");

        _.each(student.schedule, function(scheduleItem) {
          if (scheduleItem._tasksDue.length) {
            $scope.daysWithTasksDue.push(scheduleItem);
          } else {
            $scope.accomplishtoday = scheduleItem;
          }
        });

        _.each($scope.daysWithTasksDue, function(taskToAccomplish) {
          var dayUpcoming = {_date: taskToAccomplish._date, _tasksDue: new Array()};
          console.log("________________  Upcoming ************");
          console.log(dayUpcoming);

            if (taskToAccomplish._tasksDue.length) {

              taskToAccomplish.importance = true;
                var sum = 0;
              _.each(taskToAccomplish._tasksDue, function(taskDue) {
                if($scope.accomplishtoday){
                  if($scope.accomplishtoday._tasks.length){
                    _.each($scope.accomplishtoday._tasks, function(percenttoday) {
                      if(percenttoday._id === taskDue._id){
                        if(!percenttoday.percent){
                          taskDue.importance = false;
                          dayUpcoming._tasksDue.push(taskDue);
                          console.log("$$$$$$$$$$$$$$$");
                          console.log(taskDue);
                        } else{
                          taskDue.percentage = percenttoday.percent;
                          taskDue.importance = true;
                          sum++;
                        }
                      }
                    });
                  }
                }
              });

              taskToAccomplish.importance = (sum > 0)? true : false;
              if(taskToAccomplish.importance === false){

                $scope.comingUpTasks.push(taskToAccomplish);
              } else if(dayUpcoming._tasksDue.length >0){
                $scope.comingUpTasks.push(dayUpcoming);
              }

            }
        });

        $scope.student = student;
        // console.log("********** Acc TODAY **********");
        // console.log($scope.accomplishtoday);
        //
        // // console.log($scope.accomplishToday);
        // // console.log("Coming up tasks");
        // // console.log($scope.comingUpTasks);
        // console.log("+++++++++++++++++++++  !!!!!!!!!!!!!!!!!!!!!!!!!!Days with");
        // console.log($scope.daysWithTasksDue);
      })
      .catch(function(err) {
        // on error showing error
        // TODO: Add pop-up to show error
      });

    };


    $scope.getStudent();


    $scope.createTaskFunciton = function(){
      $scope.menuState = 'closed';
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
        $scope.refreshPage();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };



    $scope.infoModal = function(percentage, isTaskCompleted, taskDue, taskDueDate){
      if(taskDueDate == null){
        taskDueDate = new Date();
      }
      console.log("***************");
      console.log(taskDue);
      console.log(percentage);
      var course = {
        _id : taskDue.course,
        code: taskDue.courseName
      };
      var task = {
        _id: taskDue._id,
        name: taskDue.name,
        weight: taskDue.weight,
        dueDate: taskDueDate,
        completed: isTaskCompleted,
        course: taskDue.course
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
            return percentage;
          }
        }
      });

      editTaskModal.result
      .then(function () {
        $scope.refreshPage();
      }, function () {
        // NOTE: code here is executed when modal is cancelled
      });
    };

    $scope.labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat'];
    $scope.series = ['Series A', 'Series B'];
    $scope.max = 100;


  });
