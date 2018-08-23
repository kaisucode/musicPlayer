
var byId = function( id ) { return document.getElementById( id ); };

var timeApp  = {
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
		m = timeApp.checkTime(m);
		s = timeApp.checkTime(s);
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
	refreshTimeApp : function() {
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
	moveTimeAppRight : function() {
		if (this.focusPage["clock"])
			this.replaceGroupAWithB("clock", "timer");
		else if (this.focusPage["timer"])
			this.replaceGroupAWithB("timer", "stopwatch");
		else if (this.focusPage["stopwatch"])
			this.replaceGroupAWithB("stopwatch", "clock");

		this.refreshTimeApp();
	},
	moveTimeAppLeft : function() {
		if (this.focusPage["clock"])
			this.replaceGroupAWithB("clock", "stopwatch");
		else if (this.focusPage["timer"])
			this.replaceGroupAWithB("timer", "clock");
		else if (this.focusPage["stopwatch"])
			this.replaceGroupAWithB("stopwatch", "timer");

		this.refreshTimeApp();
	},







	updateTimer(seconds, minutes, hours){
		byId("timerSeconds").innerHTML = timeApp.checkTime(seconds);
		byId("timerMinutes").innerHTML = timeApp.checkTime(minutes);
		byId("timerHours").innerHTML = timeApp.checkTime(hours);
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
		if (timeApp.timerSeconds <= 0 && timeApp.timerMinutes <= 0 && timeApp.timerHours <= 0){
			timeApp.clearTimer();
			return;
		}

		timeApp.timerSeconds--; 
		if (timeApp.timerSeconds < 0){
			timeApp.timerMinutes--;
			timeApp.timerSeconds = 59;
		}
		if (timeApp.timerMinutes < 0){
			timeApp.timerHours--;
			timeApp.timerMinutes = 0;
		}

		timeApp.updateTimer(timeApp.timerSeconds, timeApp.timerMinutes, timeApp.timerHours);
	},
	clearTimer(){
		clearInterval(this.timerInterval);
		this.timerActivated = false;
		this.timerRunning = false;
		$(".inputTimer").css("display", "block", "important");
		timeApp.updateTimer(0, 0, 0, 0);
	},


	updateStopwatch(tens, seconds, minutes, hours){
		byId("stopwatchTens").innerHTML = timeApp.checkTime(timeApp.stopwatchTens);
		byId("stopwatchSeconds").innerHTML = timeApp.checkTime(timeApp.stopwatchSeconds);
		byId("stopwatchMinutes").innerHTML = timeApp.checkTime(timeApp.stopwatchMinutes);
		byId("stopwatchHours").innerHTML = timeApp.checkTime(timeApp.stopwatchHours);
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
		timeApp.stopwatchTens++; 

		var tempStopwatchTens = timeApp.stopwatchTens;
		var tempStopwatchSeconds = timeApp.stopwatchSeconds;
		var tempStopwatchMinutes = timeApp.stopwatchMinutes;
		var tempStopwatchHours = timeApp.stopwatchHours;

		timeApp.stopwatchTens = tempStopwatchTens%100;
		tempStopwatchSeconds += tempStopwatchTens/100;
		timeApp.stopwatchSeconds = Math.floor(tempStopwatchSeconds%60);
		tempStopwatchMinutes += tempStopwatchSeconds/60;
		timeApp.stopwatchMinutes = Math.floor(tempStopwatchMinutes%60);
		tempStopwatchHours += tempStopwatchMinutes/60;
		timeApp.stopwatchHours = Math.floor(tempStopwatchHours);

		timeApp.updateStopwatch();
	},
	clearStopwatch(){
		clearInterval(this.stopwatchInterval);
		timeApp.stopwatchTens = 0;
		timeApp.stopwatchSeconds = 0;
		timeApp.stopwatchMinutes = 0;
		timeApp.stopwatchHours = 0;
		timeApp.updateStopwatch();
		this.stopwatchRunning = false;
	},

	behaviorDetermine(){
		if (event.key === "q") {
			inApp["time"] = false;
			stopApp("timeApp");
		}
		else if (event.key === "s" && timeApp.focusPage["stopwatch"]) 
			timeApp.toggleStopwatch();
		else if (event.key === "c" && timeApp.focusPage["stopwatch"])
			timeApp.clearStopwatch();
		else if (timeApp.focusPage["timer"]){
			if (event.key === "s") 
				timeApp.toggleTimer();
			else if (event.key === "c") 
				timeApp.clearTimer();
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
			timeApp.moveTimeAppLeft();
		else if (event.which === 39)	//Right arrow
			timeApp.moveTimeAppRight();
		}
}


