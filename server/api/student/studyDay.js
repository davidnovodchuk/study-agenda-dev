// StudyDay
// used in the algorithm

function StudyDay( day , studyMinutes ) {

	this._day = new Date(day);
	this._studyMinutes = studyMinutes || 0;
	this._minutesNeededToStudy = 0;
	this._remainingMinutes = this._studyMinutes;
}
	
StudyDay.prototype = {

	constructor: StudyDay,
	getDay:function () { 
		return this._day; 
	},
	getStudyMinutes:function () { 
		return this._studyMinutes; 
	},
	getMinutesNeededToStudy:function () { 
		return this._minutesNeededToStudy; 
	},
	getRemainingMinutes:function () { 
		return this._remainingMinutes; 
	},
	setMinutesNeededToStudy:function ( newMinutesToStudy ) { 
		this._minutesNeededToStudy = newMinutesToStudy;
		this._remainingMinutes = this._studyMinutes - this._minutesNeededToStudy;
	}
}

module.exports = StudyDay;