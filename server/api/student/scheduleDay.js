// ScheduleDay
// represent one day with all tasks student needs to finish at that day

function ScheduleDay( date ) {

	this._date = date;
	this._tasks = [];
	this._percents = [];
	this._tasksDue = [];
	this._tasksTest = [];
}

ScheduleDay.prototype = {
	/*
	addTask:function ( task , percent ) {

		this._tasks.push(task);
		this._percents.push(percent);
	},
	*/
	addTask:function ( task ) {

		this._tasks.push(task);
	},
	addTaskDue:function ( task ) {

		this._tasksDue.push(task);
	},
	getDay:function () { 
		return this._date;
	},
	printTaskPercent:function ( index ) {
		console.log( this._tasks[index] + " " + this._percents[index] );
	}
}

module.exports = ScheduleDay;
