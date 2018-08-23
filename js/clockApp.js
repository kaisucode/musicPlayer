
var byId = function( id ) { return document.getElementById( id ); };

inApp = {
	"time": false
};

function stopApp(appName){
	$("#"+appName).removeClass(appName+"Start");
	$("#"+appName).addClass(appName);
}
function startApp(appName){
	$("#"+appName).removeClass(appName);
	$("#"+appName).addClass(appName+"Start");
}


var clockApp  = {
	// stopwatchInterval,
	// timerInterval,

	stopwatchTens : 00,
	stopwatchSeconds : 00, 
	stopwatchMinutes : 00,
	stopwatchHours : 00,
	timerSeconds : 0,
	timerMinutes : 0,
	timerHours : 0,
	stopwatchRunning : false,
	timerRunning : false,
	timerActivated : false,

	focusPage : {
		"clock": true, 
		"timer": false,
		"stopwatch": false
	},


	checkTime : function(i) {
		return ( i<10 ? "0"+i : i );
	},

	startTime : function() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = clockApp.checkTime(m);
		s = clockApp.checkTime(s);
		byId('current_time').innerHTML =
		h + ":" + m + ":" + s;

		var year = today.getYear()-100+2000;
		var month = today.getMonth()+1;
		var date = today.getDate();
		// var day = today.getDay();
		byId('current_date').innerHTML =
		year + "/" + month + "/" + date;

		var t = setTimeout(this.startTime, 500);
	},
	refreshClockApp : function() {
		if (this.focusPage["clock"]){
			$('.clockGroup').css('display', 'block');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'none');
		}
		else if (this.focusPage["timer"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'block');
			$('.stopwatchGroup').css('display', 'none');
		}
		else if (this.focusPage["stopwatch"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'block');
		}
	},
	replaceGroupAWithB : function(oldGroup, newGroup){
		this.focusPage[oldGroup] = false;
		this.focusPage[newGroup] = true;
		$("#"+oldGroup+"Button").removeClass("clockAppButtonSelected");
		$("#"+newGroup+"Button").addClass("clockAppButtonSelected");
	},
	moveClockAppRight : function() {
		if (this.focusPage["clock"])
			this.replaceGroupAWithB("clock", "timer");
		else if (this.focusPage["timer"])
			this.replaceGroupAWithB("timer", "stopwatch");
		else if (this.focusPage["stopwatch"])
			this.replaceGroupAWithB("stopwatch", "clock");

		this.refreshClockApp();
	},
	moveClockAppLeft : function() {
		if (this.focusPage["clock"])
			this.replaceGroupAWithB("clock", "stopwatch");
		else if (this.focusPage["timer"])
			this.replaceGroupAWithB("timer", "clock");
		else if (this.focusPage["stopwatch"])
			this.replaceGroupAWithB("stopwatch", "timer");

		this.refreshClockApp();
	},







	updateTimer(seconds, minutes, hours){
		byId("timerSeconds").innerHTML = clockApp.checkTime(seconds);
		byId("timerMinutes").innerHTML = clockApp.checkTime(minutes);
		byId("timerHours").innerHTML = clockApp.checkTime(hours);
	},
	toggleTimer(){
		clearInterval(this.timerInterval);
		if (this.timerRunning) 
			this.timerRunning = false;
		else {
			if (!this.timerActivated){
				var tempTimerSeconds = $("#timerSecondsInput").val(); 
				var tempTimerMinutes = $("#timerMinutesInput").val();
				var tempTimerHours = $("#timerHoursInput").val();
				if ((isNaN(tempTimerSeconds) || isNaN(tempTimerMinutes) || isNaN(tempTimerHours)) || (tempTimerSeconds === '0' && tempTimerMinutes === '0' && tempTimerHours === '0')){
					return;
				}

				this.timerSeconds = tempTimerSeconds%60;
				tempTimerMinutes = parseInt(tempTimerMinutes) + parseInt(tempTimerSeconds/60);
				this.timerMinutes = tempTimerMinutes%60;
				this.timerHours = parseInt(tempTimerHours) + parseInt(tempTimerMinutes/60);

				this.updateTimer(this.timerSeconds, this.timerMinutes, this.timerHours);

				this.timerActivated = true;
				$(".inputTimer").css("display", "none", "important");
			}
			this.timerInterval = setInterval(this.startTimer, 1000);
			this.timerRunning = true;
		}
	},
	startTimer() {
		if (clockApp.timerSeconds <= 0 && clockApp.timerMinutes <= 0 && clockApp.timerHours <= 0){
			clockApp.clearTimer();
			return;
		}

		clockApp.timerSeconds--; 
		if (clockApp.timerSeconds < 0){
			clockApp.timerMinutes--;
			clockApp.timerSeconds = 59;
		}
		if (clockApp.timerMinutes < 0){
			clockApp.timerHours--;
			clockApp.timerMinutes = 0;
		}

		clockApp.updateTimer(clockApp.timerSeconds, clockApp.timerMinutes, clockApp.timerHours);
	},
	clearTimer(){
		clearInterval(this.timerInterval);
		this.timerActivated = false;
		this.timerRunning = false;
		$(".inputTimer").css("display", "block", "important");
		clockApp.updateTimer(0, 0, 0, 0);
	},


	updateStopwatch(tens, seconds, minutes, hours){
		byId("stopwatchTens").innerHTML = clockApp.checkTime(clockApp.stopwatchTens);
		byId("stopwatchSeconds").innerHTML = clockApp.checkTime(clockApp.stopwatchSeconds);
		byId("stopwatchMinutes").innerHTML = clockApp.checkTime(clockApp.stopwatchMinutes);
		byId("stopwatchHours").innerHTML = clockApp.checkTime(clockApp.stopwatchHours);
	},
	toggleStopwatch(){
		clearInterval(this.stopwatchInterval);
		if (!this.stopwatchRunning) {
			this.stopwatchInterval = setInterval(this.startStopwatch, 10);
			this.stopwatchRunning = true;
		}
		else if (this.stopwatchRunning)
			this.stopwatchRunning = false;
	},
	startStopwatch(){
		clockApp.stopwatchTens++; 

		var tempStopwatchTens = clockApp.stopwatchTens;
		var tempStopwatchSeconds = clockApp.stopwatchSeconds;
		var tempStopwatchMinutes = clockApp.stopwatchMinutes;
		var tempStopwatchHours = clockApp.stopwatchHours;

		clockApp.stopwatchTens = tempStopwatchTens%100;
		tempStopwatchSeconds += tempStopwatchTens/100;
		clockApp.stopwatchSeconds = Math.floor(tempStopwatchSeconds%60);
		tempStopwatchMinutes += tempStopwatchSeconds/60;
		clockApp.stopwatchMinutes = Math.floor(tempStopwatchMinutes%60);
		tempStopwatchHours += tempStopwatchMinutes/60;
		clockApp.stopwatchHours = Math.floor(tempStopwatchHours);

		clockApp.updateStopwatch();
	},
	clearStopwatch(){
		clearInterval(this.stopwatchInterval);
		clockApp.stopwatchTens = 0;
		clockApp.stopwatchSeconds = 0;
		clockApp.stopwatchMinutes = 0;
		clockApp.stopwatchHours = 0;
		clockApp.updateStopwatch();
		this.stopwatchRunning = false;
	},

	behaviorDetermine(){
		if (event.key === "q") {
			inApp["time"] = false;
			stopApp("clockApp");
		}
		else if (event.key === "s" && clockApp.focusPage["stopwatch"]) 
			clockApp.toggleStopwatch();
		else if (event.key === "c" && clockApp.focusPage["stopwatch"])
			clockApp.clearStopwatch();
		else if (clockApp.focusPage["timer"]){
			if (event.key === "s") 
				clockApp.toggleTimer();
			else if (event.key === "c") 
				clockApp.clearTimer();
			else if (event.key === "H"){
				event.preventDefault();
				$("#timerHoursInput").focus();
				$("#timerHoursInput").val("");
			}
			else if (event.key === "M"){
				event.preventDefault();
				$("#timerMinutesInput").focus();
				$("#timerMinutesInput").val("");
			}
			else if (event.key === "S"){
				event.preventDefault();
				$("#timerSecondsInput").focus();
				$("#timerSecondsInput").val("");
			}
			else if (event.which === 27){		// Esc
				$("#timerButton").focus();
				$("#timerButton").css("outline", "none");
			}
		}

		if (event.which === 37)	// Left
			clockApp.moveClockAppLeft();
		else if (event.which === 39)	//Right arrow
			clockApp.moveClockAppRight();
		}
}


$(document).ready(function() {
	clockApp.startTime();

	document.addEventListener("keydown", function onEvent(event) {
		if (inApp["time"]){
			clockApp.behaviorDetermine();
		}
		else if (event.key === "T"){
			inApp["time"] = true;
			startApp("clockApp");
			clockApp.refreshClockApp();
		}
	});
});

