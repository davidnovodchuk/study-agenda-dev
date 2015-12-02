'use strict';

angular.module('studyAgendaApp')
.controller('StudentEnrollmentsCtrl', function ($scope, $anchorScroll, User, Student) {
	var getEnrollments = function() {
		new Student().$getEnrollments({id: 'me'})
		.then(function(student) {
			$scope.enrollments = student.enrollments;
			$scope.student = student;
		})
		.catch(function(err) {
			// on error showing error
			// TODO: Add pop-up to show error
		});
	};

	getEnrollments();

	$scope.getEnrollments = function() {
		getEnrollments();
	};

	$scope.deleteEnrollment = function(enrollmentId) {
		new User().$get()
		.then(function(currentUser) {
			_.remove(currentUser.enrollments, {
	    	_id: enrollmentId
			});

			currentUser.$update()
			.then(function(updatedUser) {
				getEnrollments();
			})
			.catch(function(err) {});
		})
		.catch(function(err) {});
	};

	$scope.editEnrollment = function(enrollment) {
		$scope.isInEditMode = true;
		$scope.enrollmentToEdit = enrollment;
		$anchorScroll();
	};

	$scope.cancelEditEnrollment = function() {
		$scope.isInEditMode = false;
	};
});
