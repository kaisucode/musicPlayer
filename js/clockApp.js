
var byId = function( id ) { return document.getElementById( id ); };

inApp = {
	"time": false
};


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
			// activateTimerInput();
		}
		else if (this.focusPage["stopwatch"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'block');
		}
	},
	moveClockAppRight : function() {
		if (this.focusPage["clock"]){
			this.focusPage["clock"] = false;
			this.focusPage["timer"] = true;
			$("#clockButton").removeClass("clockAppButtonSelected");
			$("#timerButton").addClass("clockAppButtonSelected");
		}
		else if (this.focusPage["timer"]){
			this.focusPage["timer"] = false;
			this.focusPage["stopwatch"] = true;
			$("#timerButton").removeClass("clockAppButtonSelected");
			$("#stopwatchButton").addClass("clockAppButtonSelected");
		}
		else if (this.focusPage["stopwatch"]){
			this.focusPage["stopwatch"] = false;
			this.focusPage["clock"] = true;
			$("#stopwatchButton").removeClass("clockAppButtonSelected");
			$("#clockButton").addClass("clockAppButtonSelected");
		}
		this.refreshClockApp();
	},
	moveClockAppLeft : function() {
		if (this.focusPage["clock"]){
			this.focusPage["clock"] = false;
			this.focusPage["stopwatch"] = true;
			$("#clockButton").removeClass("clockAppButtonSelected");
			$("#stopwatchButton").addClass("clockAppButtonSelected");
		}
		else if (this.focusPage["timer"]){
			this.focusPage["timer"] = false;
			this.focusPage["clock"] = true;
			$("#timerButton").removeClass("clockAppButtonSelected");
			$("#clockButton").addClass("clockAppButtonSelected");
		}
		else if (this.focusPage["stopwatch"]){
			this.focusPage["stopwatch"] = false;
			this.focusPage["timer"] = true;
			$("#stopwatchButton").removeClass("clockAppButtonSelected");
			$("#timerButton").addClass("clockAppButtonSelected");
		}
		this.refreshClockApp();
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

				clockApp.timerSeconds = tempTimerSeconds%60;
				tempTimerMinutes = parseInt(tempTimerMinutes) + parseInt(tempTimerSeconds/60);
				clockApp.timerMinutes = tempTimerMinutes%60;
				clockApp.timerHours = parseInt(tempTimerHours) + parseInt(tempTimerMinutes/60);
				byId("timerSeconds").innerHTML = clockApp.checkTime(clockApp.timerSeconds);
				byId("timerMinutes").innerHTML = clockApp.checkTime(clockApp.timerMinutes);
				byId("timerHours").innerHTML = clockApp.checkTime(clockApp.timerHours);

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
		byId("timerSeconds").innerHTML = clockApp.checkTime(clockApp.timerSeconds);
		byId("timerMinutes").innerHTML = clockApp.checkTime(clockApp.timerMinutes);
		byId("timerHours").innerHTML = clockApp.checkTime(clockApp.timerHours);
	},
	clearTimer(){
		clearInterval(this.timerInterval);
		this.timerActivated = false;
		this.timerRunning = false;
		$(".inputTimer").css("display", "block", "important");
		byId("timerSeconds").innerHTML = "00";
		byId("timerMinutes").innerHTML = "00";
		byId("timerHours").innerHTML = "00";
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
	updateStopwatch(tens, seconds, minutes, hours){
		byId("stopwatchTens").innerHTML = clockApp.checkTime(tens);
		byId("stopwatchSeconds").innerHTML = clockApp.checkTime(seconds);
		byId("stopwatchMinutes").innerHTML = clockApp.checkTime(minutes);
		byId("stopwatchHours").innerHTML = clockApp.checkTime(hours);
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

		clockApp.updateStopwatch(clockApp.stopwatchTens, clockApp.stopwatchSeconds, clockApp.stopwatchMinutes, clockApp.stopwatchHours);
	},
	clearStopwatch(){
		clearInterval(this.stopwatchInterval);
		clockApp.stopwatchTens = 0;
		clockApp.stopwatchSeconds = 0;
		clockApp.stopwatchMinutes = 0;
		clockApp.stopwatchHours = 0;
		clockApp.updateStopwatch(clockApp.stopwatchTens, clockApp.stopwatchSeconds, clockApp.stopwatchMinutes, clockApp.stopwatchHours);
		this.stopwatchRunning = false;
	}


}

$(document).ready(function() {

	$("#clockButton").addClass("clockAppButtonSelected");
	clockApp.startTime();

	document.addEventListener("keydown", function onEvent(event) {
		if (event.key === "q") {
			inApp["time"] = false;
			$("#clockApp").removeClass("clockAppS");
			$("#clockApp").addClass("clockApp");
		}
		else if (event.key === "T"){
			inApp["time"] = true;
			$("#clockApp").removeClass("clockApp");
			$("#clockApp").addClass("clockAppS");
			clockApp.refreshClockApp();
			function activateTimerInput(){
				if (timerSeconds === 0 && timerMinutes === 0 && timerHours === 0){
					$(".showTimer").css("display", "none", "important");
					$(".inputTimer").css("display", "block", "important");
				}	
			}
		}
		else if (inApp["time"]){
			if (event.key === "s" && clockApp.focusPage["stopwatch"]) 
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
	});


});

