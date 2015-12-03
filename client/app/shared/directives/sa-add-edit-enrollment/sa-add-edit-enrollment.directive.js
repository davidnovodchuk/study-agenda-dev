'use strict';

angular.module('sa-add-edit-enrollment', [])

.directive('saAddEditEnrollment', function($modal, User, School, Campus, ngNotify) {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/directives/sa-add-edit-enrollment/sa-add-edit-enrollment.html',
    scope: {
      newEnrollment: '=?',
      isInEditMode: '=?',
      cancelEditFunction: '=?',
      afterSuccessSubmitFunction: '=?'
    },
    link: function($scope){
      $scope.campuses = [];
      $scope.courses = [];
      $scope.newEnrollment = {};

      $scope.$watch('isInEditMode', function(newValue) {
        if (newValue) {
          $scope.schoolSelected($scope.newEnrollment.school);

          _.each($scope.newEnrollment.campuses, function(campus) {
            $scope.campusSelected(campus);
          });
        }
      });

      var getSchools = function() {
        $scope.schools = School.query();
      };

      getSchools();

      var getSchoolCampuses = function(schoolId) {
        new School().$getWithPopulatedReferences({id: schoolId})
        .then(function(school) {
          if(!school.campuses.length) {
            $scope.campuses = [{
              name: '',
              address: '',
              isNew: true
            }];
          } else {
            $scope.campuses = school.campuses;
          }
        })
        .catch(function(err) {
          // TODO: show error
        });
      };

      var getCampusesCourses = function(campuses) {
        $scope.courses = [];

        _.each(campuses, function(campus) {
          new Campus().$getWithPopulatedReferences({id: campus._id})
          .then(function(campusFromDb) {
            _.each(campusFromDb.courses, function(course) {
              course.campusName = campusFromDb.name;
              course.displayText = course.code + ' ' + course.section + ' (' + course.campusName + ' Campus)';
              $scope.courses.push(course);
            });
          })
          .catch(function(err) {
            // TODO: show error
          });
        });

        if(!$scope.courses.length) {
          $scope.courses.push({
            code: '',
            title: '',
            isNew: true
          });
        }
      };

      var createCampus = function(campusName, schoolId, schoolName) {

        var createSchoolModal = $modal.open({
          templateUrl: 'createCampusDialog',
          resolve: {
            campusName: function() {
              return campusName;
            },
            schoolId: function() {
              return schoolId;
            },
            schoolName: function() {
              return schoolName;
            }
          },
          controller: ['$scope', '$modalInstance', 'Campus', 'campusName', 'schoolId', 'schoolName',
           function($scope, $modalInstance, Campus, campusName, schoolId, schoolName) {
            $scope.schoolName = schoolName;
            $scope.newCampus = new Campus();
            $scope.newCampus.school = schoolId;
            $scope.newCampus.name = campusName;

            $scope.cancel = function() {
              $modalInstance.dismiss();
            };

            $scope.addCampus = function() {
              if ($scope.addCampusForm.$valid) {
                $scope.newCampus.$save()
                .then( function(campus) {
                  $modalInstance.close(campus);
                })
                .catch(function(err) {
                  // TODO: Add use pop-up to show error
                });
              }
            };
          }]
        });

        createSchoolModal.result
        .then(function (createdCampus) {
          getSchoolCampuses(schoolId);

          if (!$scope.newEnrollment.campuses){
            $scope.newEnrollment.campuses = [];
          }
          $scope.newEnrollment.campuses.push(createdCampus);
        }, function () {
          // NOTE: code here is executed when modal is cancelled
        });
      };

      var createCourse = function(courseName, campuses) {

        var createSchoolModal = $modal.open({
          templateUrl: 'createCourseDialog',
          resolve: {
            courseCode: function() {
              return courseName;
            },
            campuses: function() {
              return campuses;
            }
          },
          controller: ['$scope', '$modalInstance', 'Course', 'courseCode', 'campuses',
           function($scope, $modalInstance, Course, courseCode, campuses) {
            $scope.newCourse = new Course();
            $scope.newCourse.code = courseCode;

            if (campuses.length === 1) {
              $scope.newCourse.campus = campuses[0]._id;
              $scope.campusName = campuses[0].name;
            } else {
              $scope.campuses = campuses;
              $scope.multipleCampuses = true;
            }

            $scope.cancel = function() {
              $modalInstance.dismiss();
            };

            $scope.addCourse = function() {
              if ($scope.addCourseForm.$valid) {
                $scope.newCourse.$save()
                .then(function(course) {
                  $modalInstance.close(course);
                })
                .catch(function(err) {
                  // TODO: Add use pop-up to show error
                });
              }
            };
          }]
        });

        createSchoolModal.result
        .then(function (createdCourse) {
          getCampusesCourses($scope.newEnrollment.campuses);
          createdCourse.campusName = _.result(_.find($scope.newEnrollment.campuses, {
            '_id': createdCourse.campus
          }), 'name');

          if (!$scope.newEnrollment.courses){
            $scope.newEnrollment.courses = [];
          }
          $scope.newEnrollment.courses.push(createdCourse);
        }, function () {
          // NOTE: code here is executed when modal is cancelled
        });
      };

      $scope.refreshSchools = function(select) {
        if(select.search) {
          var item = {
             name: 'Create new school: \"' + select.search + '\"',
             originalName: select.search,
             isNew: true
          };

          if ($scope.schools[$scope.schools.length - 1].isNew) {
            $scope.schools[$scope.schools.length - 1] = item;
          } else {
            $scope.schools.push(item);
          }
        } else {
          if ($scope.schools[$scope.schools.length - 1].isNew) {
            $scope.schools.pop();
          }
        }
      };

      $scope.refreshCampuses = function(select) {
        if(select.search) {
          var item = {
             name: 'Create new campus: \"' + select.search + '\"',
             address: '',
             originalName: select.search,
             isNew: true
          };

          if ($scope.campuses[$scope.campuses.length - 1].isNew) {
            $scope.campuses[$scope.campuses.length - 1] = item;
          } else {
            $scope.campuses.push(item);
          }
        } else if ($scope.campuses[$scope.campuses.length - 1]) {
          if ($scope.campuses[$scope.campuses.length - 1].isNew) {
            $scope.campuses.pop();
          }
        }
      };

      $scope.refreshCourses = function(select) {
        if(select.search) {
          var item = {
             code: 'Create new course: \"' + select.search + '\"',
             title: '',
             originalCode: select.search,
             isNew: true
          };

          if ($scope.courses[$scope.courses.length - 1].isNew) {
            $scope.courses[$scope.courses.length - 1] = item;
          } else {
            $scope.courses.push(item);
          }
        } else if ($scope.courses[$scope.courses.length - 1]) {
          if ($scope.courses[$scope.courses.length - 1].isNew) {
            $scope.courses.pop();
          }
        }
      };

      $scope.schoolSelected = function(item) {
        if (item.isNew) {
          var newSchool = new School();
          newSchool.name = item.originalName;

          newSchool.$save()
          .then( function(school) {
            item = school;
            $scope.newEnrollment.school = item;
            getSchools();
          })
          .catch(function(err) {
            // TODO: Add use pop-up to show error
          });
        } else {
          getSchoolCampuses(item._id);
        }
      };

      $scope.createNewCampus = function (newTag) {
        var item = {
           name: 'Create new campus: \"' + newTag + '\"',
           originalName: newTag,
           address: '',
           isNew: true
        };

        if ($scope.campuses[$scope.campuses.length - 1].isNew) {
          $scope.campuses[$scope.campuses.length - 1] = item;
        } else {
          $scope.campuses.push(item);
        }

        return item;
      };

      $scope.campusSelected = function(item) {
        if (item.isNew) {
          _.remove($scope.newEnrollment.campuses, {
            isNew: true
          });
          createCampus(item.originalName, $scope.newEnrollment.school._id, $scope.newEnrollment.school.name);
        } else {
          var itemAlreadyAdded = _.some($scope.newEnrollment.campuses, function (campus) {
            return campus._id === item._id;
          });

          if (!itemAlreadyAdded) {
            if (!$scope.newEnrollment.campuses){
              $scope.newEnrollment.campuses = [];
            }
            $scope.newEnrollment.campuses.push(item);
          }
        }

        getCampusesCourses($scope.newEnrollment.campuses);
      };

      $scope.createNewCourse = function (newTag) {
        var item = {
           code: 'Create new course: \"' + newTag + '\"',
           originalCode: newTag,
           title: '',
           isNew: true
        };

        if ($scope.courses[$scope.courses.length - 1].isNew) {
          $scope.courses[$scope.courses.length - 1] = item;
        } else {
          $scope.courses.push(item);
        }

        return item;
      };

      $scope.courseSelected = function(item) {
        if (item.isNew) {
          _.remove($scope.newEnrollment.courses, {
            isNew: true
          });
          createCourse(item.originalCode, $scope.newEnrollment.campuses);
        } else {
          var itemAlreadyAdded = _.some($scope.newEnrollment.courses, function (course) {
            return course._id === item._id;
          });

          if (!itemAlreadyAdded) {
            if (!$scope.newEnrollment.courses){
              $scope.newEnrollment.courses = [];
            }
            $scope.newEnrollment.courses.push(item);
          }
        }
      };

      $scope.cancelAddEnrollmentForm = function() {
        $scope.newEnrollment = {};
        $scope.cancelEditFunction && $scope.cancelEditFunction();
        $scope.afterSuccessSubmitFunction && $scope.afterSuccessSubmitFunction();
        $scope.addEnrollmentForm.$setPristine();
      };

      $scope.isAddEnrollmentFormValid = function() {
        return $scope.newEnrollment.school &&
          $scope.newEnrollment.campuses && !!$scope.newEnrollment.campuses.length &&
          $scope.newEnrollment.courses && !!$scope.newEnrollment.courses.length;
      };

      $scope.addEnrollment = function() {
        if ($scope.isAddEnrollmentFormValid()) {
          new User().$get()
          .then(function(currentUser) {
            var newEnrollment = {};
            var existingEnrollmentId = $scope.newEnrollment._id;

            newEnrollment.school = $scope.newEnrollment.school._id;
            newEnrollment.campuses = _.pluck($scope.newEnrollment.campuses, '_id');
            newEnrollment.courses = _.pluck($scope.newEnrollment.courses, '_id');

            if (existingEnrollmentId) {
              var enrollmentIndex = _.indexOf(currentUser.enrollments, _.find(currentUser.enrollments, {_id: existingEnrollmentId}));

              currentUser.enrollments.splice(enrollmentIndex, 1, newEnrollment);
            } else {
              currentUser.enrollments.push(newEnrollment);
            }

            currentUser.$update()
            .then(function(updatedUser) {
              ngNotify.config({
                position: 'top',
                type: 'success',
                button: 'true',
                html: 'true'
              });
              ngNotify.set('Enrollment was successfully saved');

              $scope.newEnrollment = {};
              $scope.addEnrollmentForm.$setPristine();

              $scope.cancelEditFunction && $scope.cancelEditFunction();
              $scope.afterSuccessSubmitFunction && $scope.afterSuccessSubmitFunction();
            })
            .catch(function(err) {
              ngNotify.config({
                position: 'top',
                type: 'error',
                button: 'true',
                html: 'true'
              });
              ngNotify.set('The system was not able to save enrollment');
            });
          })
          .catch(function(err) {});
        }
      };

      $scope.removeNewEnrollmentSchool = function() {
        $scope.cancelAddEnrollmentForm();
      };

      $scope.removeNewEnrollmentCampus = function(campusId) {
        _.remove($scope.newEnrollment.campuses, {
          _id: campusId
        });

        getCampusesCourses();
      };

      $scope.removeNewEnrollmentCourse = function(courseId) {
        _.remove($scope.newEnrollment.courses, {
          _id: courseId
        });
      };
    }
  };
});
