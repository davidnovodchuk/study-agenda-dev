'use strict';

var User = require('../user/user.model');
var Task = require('../task/task.model');
var _ = require('lodash');
var Q = require('q');
var School = require('../school/school.model');
var StudyDay = require("./studyDay.js");
var ScheduleDay = require("./scheduleDay.js");
var CONSANTS = require("../../lib/constants");
var TASK_PRIVACY_TYPES = CONSANTS.TASK_PRIVACY_TYPES;
var TASK_MODIFICATION_TYPES = CONSANTS.TASK_MODIFICATION_TYPES;

exports.myCoursesTasks = function(req, res) {
  var studentId = req.user._id;

  return Q(
    User.findById(studentId)
    .populate(['enrollments.courses','modifiedTasks.task'])
    .select('enrollments.courses modifiedTasks')
    .exec()
  )
  .then(function(student){
    return User.populate(student, {
      path: 'enrollments.courses.tasks',
      model: Task
    });
  })
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    return res.json(student);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

exports.addTaskModification = function(req, res) {
  var studentId = req.user._id;
  var newTaskModification = req.body.newTaskModification;

  if (req.params.id !== 'me') {
    studentId = req.params.id;
  }

  return Q(
    User.findById(studentId)
    .select('-hashedPassword -salt')
    .exec()
  )
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    var taskToModify = _.findWhere(student.modifiedTasks, function(modifiedTask) {
      return modifiedTask.task.toString() === newTaskModification.task.toString();
    });

    if (taskToModify) {
      taskToModify.modificationType = newTaskModification.modificationType;
    } else {
      student.modifiedTasks.push(newTaskModification);
    }

    return Q(
      student.save()
    )
    .then(function(student) {

      return res.status(200).json(student);
    });
  })
  .fail(function(err) {

    return handleError(res, err);
  });
};

exports.getMyEnrollments = function(req, res) {
  var studentId = req.user._id;

  return Q(
    User.findById(studentId)
    .populate(['enrollments.school', 'enrollments.campuses', 'enrollments.courses'])
    .select('enrollments._id enrollments.school enrollments.campuses enrollments.courses')
    .exec()
  )
  .then(function(student){
    if(!student) {
      return res.send(401);
    }

    return res.json(student);
  })
  .fail(function(err) {

    return handleError(res, err);
  });
}

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.getSchedule = function(req, res, next) {
  var userId = req.body._id;
  var today = req.body.today || new Date();

  return Q(
    User.findById(userId)
    .exec()
  )
  .then(function(user) {
    if(!user) {
      return res.send(404);
    }

    return Q(
      exports._calculateSchedule(user, today)
    )
    .then(function(schedule) {
      schedule = _.filter(schedule, function(scheduleDay) {
        return (scheduleDay._date.setHours(0,0,0,0) === today.setHours(0,0,0,0) && scheduleDay._tasks.length) ||
          scheduleDay._tasksDue.length;
      });

      res.json(schedule);
    });
  })
  .fail(function(err) {
    return handleError(res, err);
  });
};

exports._calculateSchedule = function(user, today) {
  var user = user || {};

	// I don't remember why subtractFromTotalDays is needed, this is why I keep it for now
	var subtractFromTotalDays
	if (typeof(subtractFromTotalDays)==='undefined') subtractFromTotalDays = 0;

	// array of StudyDay
	var studyDays = [];

	// changing studyDays arrayList:
	// initializing all remainingMinutes to studyMinutes and minutesNeededToStudy to zero
	for( var item = 0 ; item < user.studyDays.length ; item++ ) {

		var currentDay = user.studyDays[item];
		studyDays[item] = new StudyDay( currentDay.day , currentDay.minutes );
	}

	/*
	var add = (function (nt) {
    	var t = [];
	    return function (nt) {return t.concat(nt);}
	})();
	*/
	// all courses that the student is enrolled in
	var courses = [];

	for( var i = 0 ; i < user.enrollments.length ; i++ ) {
		var enrollment = user.enrollments[i];
		courses = courses.concat(enrollment.courses);
		/*
		for( var j = 0 ; j < enrollment.courses.length ; j++) {

			var course_id = enrollment.courses[j];
			TaskModel.getTasksForCourse(course_id, function(err, newTasks){
				if(err) {
					console.log(err);
					res.status(500).json({status: 'failure'});
				} else {
					// tasks = tasks.concat(newTasks);
					// console.log(tasks);
					console.log(add(newTasks));
				}
			});
		}
		*/
	}
	// identifing what tasks not include for student
	var tasksNotInclude = [];
	for( var i = 0 ; i < user.modifiedTasks.length ; i++ ) {
		var currentModifiedTask = user.modifiedTasks[i];
		if( currentModifiedTask.modificationType === TASK_MODIFICATION_TYPES.NOT_APPLY ||
			currentModifiedTask.modificationType === TASK_MODIFICATION_TYPES.COMPLETED) {
			tasksNotInclude.push(currentModifiedTask.task);
		}
	}
	// using today's date in order not to find tasks with the due date today or before today
	// var today = new Date();
	today.setHours(23,59,59,0);

	// TaskModel.find({ $and: [ {course: { $in : courses }} , { dueDate: { $gte: today }} ] }).lean()
	//   .populate('course')
	//   .exec(function(err, tasks){
	// 	if(err) {
	// 		console.log(err);
	// 		res.status(500).json({status: 'failure'});
	// 	} else {
  return Q(
    Task.find()
    .and([
      { course: { $in : courses }},
      { dueDate: { $gte: today }}
    ])
    .populate('course')
    .exec()
  )
  .then(function(tasks) {
  	// removing tasks that the student decided not to include
  	// in his tasks
  	if(tasksNotInclude.length > 0)
  	{
  		for( var i = tasks.length - 1 ; i >= 0 ; i-- ) {
  			for( var j = 0 ; j < tasksNotInclude.length ; j++ ) {
  				if( tasks[i]._id.toString() ===
  					tasksNotInclude[j].toString() ){
  					tasks.splice(i,1);
  					j = tasksNotInclude.length ;
  				}
  			}
  		}
  	}

  	// console.log(tasks);
  	// Sorting tasks by date:
  	function compareTasks(a,b) {
  	  if (a.dueDate < b.dueDate)
  		 return -1;
  	  if (a.dueDate > b.dueDate)
  		return 1;
  	  return 0;
  	}
  	tasks.sort(compareTasks);

  	function compareDays(a,b) {
  	  if (a.getDay() < b.getDay())
  		 return -1;
  	  if (a.getDay() > b.getDay())
  		return 1;
  	  return 0;
  	}

  	// Sorting StudyDays by date:
  	studyDays.sort(compareDays);

  	// creation of schedule
  	var schedule = [];

  	// Adding tasks to tasksDue in schedule
  	for( var i = 0 ; i < tasks.length ; i++ ) {

  		tasks[i].dueDate.setHours(0,0,0,0);
  		var check = 0;
  		for(var j = 0; j < schedule.length; j++) {
  			if( schedule[j].getDay().getTime() === tasks[i].dueDate.getTime() )
  			{
  				// var taskName = tasks[i].course.code + " - " +
  				// 		tasks[i].name;
          var task = {
    				_id: tasks[i]._id,
    				name: tasks[i].name,
    				weight: tasks[i].weight,
            course: tasks[i].course._id,
            courseName: tasks[i].course.code
    			};
  				/*
  				var task = tasks[i].course.code + " " +
  						tasks[i].name;
  				*/
  				schedule[j].addTaskDue( task );
  				check = 1;
  			}
      }

  		if(check === 0) {
  			// console.log( studyDays[i].getDay() );
  			var newSchDay = new ScheduleDay( tasks[i].dueDate );

  			// var taskName = tasks[i].course.code + " - " +
  			// 		tasks[i].name;
  			var task = {
  				_id: tasks[i]._id,
  				name: tasks[i].name,
  				weight: tasks[i].weight,
          course: tasks[i].course._id,
          courseName: tasks[i].course.code
  			};
  			/*
  			var task = tasks[i].course.code + " " +
  					tasks[i].name;
  			*/

  			newSchDay.addTaskDue( task );

  			schedule.push( newSchDay );
  		}
  	}
  	// calculating tasks average weight
  	var weightSum = 0 ;
  	var weightCounter = 0 ;
  	for( var item in tasks) {
  		if( tasks[item].weight > 0 ) {
  			weightSum += tasks[item].weight ;
  			weightCounter ++ ;
  		}
  	}
  	var weightAvg = weightSum / weightCounter ;
  	var naWeightTasks = [];
  	for( var item in tasks) {
  		if( tasks[item].weight === 0 ) {
  			tasks[item].weight = weightAvg ;
  		}
  	}

  	if( tasks[tasks.length - 1] != undefined ) {
  		// adding days to the schedule, until the last assignment
  		while( studyDays[studyDays.length - 1].getDay() <
  		  tasks[tasks.length - 1].dueDate ) {

  			// we assume that the student will study the same amount of time in every Monday, Tuesday ...
  			// inAWeek stores date 7 days after checked date (studyDays[ i - 7 ])
  			var i = studyDays.length;
  			var inAWeek = new Date( studyDays[ i - 7 ].getDay().valueOf() + 7 * 24 * 60 * 60 * 1000 );
  			studyDays.push( new StudyDay( inAWeek , studyDays[ i - 7 ].getStudyMinutes() ) );
  		}
  		// removing days from schedule that are before today
  		// var today = new Date();
  		today.setHours(0,0,0,0);
  		while( studyDays[0].getDay() < today ) {
  			studyDays.splice(0, 1);
  		}
  		// removing days from schedule that are after the last assignment
  		while( studyDays[studyDays.length - 1].getDay().getTime() > tasks[tasks.length - 1].dueDate.getTime() ) {
  			studyDays.splice(studyDays.length - 1, 1);
  		}
  	}
  	// calculation:
  	///////////////////////////////////////////////////////////////////////////////
  	for( var item = tasks.length - 1 ; item >= 0 ; item -- ) {

  		// calculate how many days to spend
  		var totlaPercents = 0 ;
  		for( var assignmentIndex = 0 ; assignmentIndex < tasks.length ; assignmentIndex++ ) {
  			totlaPercents += tasks[assignmentIndex].weight;
      }
  		// console.log(studyDays);
  		var totalDays = studyDays.length - 1 - subtractFromTotalDays;
  		var daysToStudy = totalDays * tasks[item].weight / totlaPercents;

  		// total minutes from now until the due date
  		var i = 0, totalMinutes = 0, counter = 1;

  		//setting time to 0 in order to compare between dates
  		tasks[item].dueDate.setHours(0,0,0,0)

  		while (!!studyDays[i] && studyDays[i].getDay().getTime() < tasks[item].dueDate.getTime()) {
        totalMinutes += studyDays[i].getRemainingMinutes();
  			i++;
  			counter++;
  		}

  		if ( i > 0 ) {
        i--
      }
  		if ( counter > 1 ) {
        counter--
      }
  		//totalMinutes += studyDays[i].getStudyMinutes();
  		// based on how many days, we calculate how many hours to spend
  		var TotalMinutesToStudy = totalMinutes / counter * daysToStudy;

  		// split the hours to spend between the days before the due time
  		var minutesToSplit = TotalMinutesToStudy;

  		while( minutesToSplit > 0 && studyDays[i] != undefined ) {

  			// if( studyDays[i] != undefined ) {
  				if( studyDays[i].getRemainingMinutes() > 0 ) {
  					if( studyDays[i].getRemainingMinutes() >= minutesToSplit ) {

  						studyDays[i].setMinutesNeededToStudy( minutesToSplit );
  						minutesToSplit = 0;
  					}
  					else {
  						minutesToSplit = minutesToSplit - studyDays[i].getRemainingMinutes();
  						studyDays[i].setMinutesNeededToStudy
  							( studyDays[i].getStudyMinutes() );

  						i--;
  					}
  				}
  				else i--;
  			// }
  		}

  		// calculate how much to finish in each day (in percentage)

  		// minDone - how much minutes the student spent
  		var minDone = 0;
  		// minTotal - how much minutes needs to be spent in total
  		var minTotal = TotalMinutesToStudy;
  		// percent is what percentage of the assignment needed to be done
  		var percent = 0;

  		for ( i = 0; i < studyDays.length; i++) {
  			// console.log( studyDays[i] );
  			// minToday minutes needed for studying in the current day:
  			var minToday = studyDays[i].getMinutesNeededToStudy();
  			// minWorkToday - how many minutes to work in the current day:
  			var minWorkToday = 0;

  			if( minToday > 0 && percent < 100) {

  				if( minToday <= minTotal / 10)
  					minWorkToday = minTotal / 10;
  				else if( minToday <= minTotal * 2 / 10)
  					minWorkToday = minTotal * 2 / 10;
  				else if( minToday <= minTotal * 3 / 10)
  					minWorkToday = minTotal * 3 / 10;
  				else if( minToday <= minTotal * 4 / 10)
  					minWorkToday = minTotal * 4 / 10;
  				else if( minToday <= minTotal * 5 / 10)
  					minWorkToday = minTotal * 5 / 10;
  				else if( minToday <= minTotal * 6 / 10)
  					minWorkToday = minTotal * 6 / 10;
  				else if( minToday <= minTotal * 7 / 10)
  					minWorkToday = minTotal * 7 / 10;
  				else if( minToday <= minTotal * 8 / 10)
  					minWorkToday = minTotal * 8 / 10;
  				else if( minToday <= minTotal * 9 / 10)
  					minWorkToday = minTotal * 9 / 10;
  				else
  					minWorkToday = minTotal;

  				minDone += minWorkToday;
  				percent = Math.round(((minDone * 100 / minTotal) / 10 ) * 10);

  				if( studyDays[i+1] && studyDays[i+1].getDay().getTime() >= tasks[item].dueDate.getTime()) {
            percent = 100;
          }
  				if( percent > 100 ) {
            percent = 100;
          }
  				// output for debugging purposes
  				if( percent !== 0 && !isNaN(percent) ) {
  					var check = 0;
  					for(var k = 0; k < schedule.length; k++)
  						if( schedule[k].getDay().getTime() == studyDays[i].getDay().getTime() )
  						{
  							var taskName = tasks[item].course.code + " - " +
  									tasks[item].name;
  							var task = {
  								_id: tasks[item]._id,
  								name: taskName,
  								percent: percent
  							};

  							//schedule[k].addTask( task , percent );
  							schedule[k].addTask( task );
  							check = 1;
  						}

  					if(check == 0) {
  						// console.log( studyDays[i].getDay() );
  						var newSchDay = new ScheduleDay( studyDays[i].getDay() );

  						var taskName = tasks[item].course.code + " - " +
  								tasks[item].name;
  						var task = {
  							_id: tasks[item]._id,
  							name: taskName,
  							percent: percent
  						};

  						//newSchDay.addTask( task , percent );
  						newSchDay.addTask( task );

  						schedule.push( newSchDay );
  					}
  				}
  			}
  		}
  	}
  	// Sorting schedule by date:
  	schedule.sort(compareDays);
  	/*
  	for (var i = schedule.length - 1; i >= 0; i--) {
  		console.log(schedule[i]._tasksDue);
  	};
  	*/
  	// cb(err, schedule);
    return schedule;
  });
	// });
};

function handleError(res, err) {
  return res.send(500, err);
}
