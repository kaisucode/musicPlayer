
inApp = {
	"time": false
};
var self = this;

var stopwatchTens = 00;
var stopwatchSeconds = 00; 
var stopwatchMinutes = 00;
var stopwatchHours = 00;

var timerSeconds = 0; 
var timerMinutes = 0;
var timerHours = 0;

function checkTime(i) {
	return ( i<10 ? "0"+i : i );
}

var clockApp  = {
	// stopwatchInterval,
	// timerInterval,

	stopwatchRunning : false,
	timerRunning : false,
	timerActivated : false,
	focusPage : {
		"clock": true, 
		"timer": false,
		"stopwatch": false
	},

	startTime : function() {
		var today = new Date();
		var h = today.getHours();
		var m = today.getMinutes();
		var s = today.getSeconds();
		m = checkTime(m);
		s = checkTime(s);
		document.getElementById('current_time').innerHTML =
		h + ":" + m + ":" + s;

		var year = today.getYear()-100+2000;
		var month = today.getMonth()+1;
		var date = today.getDate();
		// var day = today.getDay();
		document.getElementById('current_date').innerHTML =
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

				timerSeconds = tempTimerSeconds%60;
				tempTimerMinutes += tempTimerSeconds/60;
				timerMinutes = Math.floor(tempTimerMinutes%60);
				timerHours = Math.floor(tempTimerHours + tempTimerMinutes/60);

				document.getElementById("timerSeconds").innerHTML = checkTime(timerSeconds);
				document.getElementById("timerMinutes").innerHTML = checkTime(timerMinutes);
				document.getElementById("timerHours").innerHTML = checkTime(timerHours);

				timerActivated = true;
				$(".inputTimer").css("display", "none", "important");
			}
			this.timerInterval = setInterval(this.startTimer, 1000);
			this.timerRunning = true;
		}
	},
	startTimer() {
		var appendTimerSeconds = document.getElementById("timerSeconds");
		var appendTimerMinutes = document.getElementById("timerMinutes");
		var appendTimerHours = document.getElementById("timerHours");

		if (timerSeconds <= 0 && timerMinutes <= 0 && timerHours <= 0){
			clockApp.clearTimer();

			return;
		}

		timerSeconds--; 
		
		if (timerSeconds < 0){
			timerMinutes--;
			appendTimerMinutes.innerHTML = checkTime(timerMinutes);
			timerSeconds = 59;
		}
		appendTimerSeconds.innerHTML = checkTime(timerSeconds);


		if (timerMinutes < 0){
			timerHours--;
			appendTimerHours.innerHTML = checkTime(timerHours);
			timerMinutes = 0;
		}
		appendTimerMinutes.innerHTML = checkTime(timerMinutes);
		appendTimerHours.innerHTML = checkTime(timerHours);
	},
	clearTimer(){
		clearInterval(this.timerInterval);
		timerActivated = false;
		timerRunning = false;
		$(".inputTimer").css("display", "block", "important");
		document.getElementById("timerSeconds").innerHTML = "00";
		document.getElementById("timerMinutes").innerHTML = "00";
		document.getElementById("timerHours").innerHTML = "00";
		timerRunning = false;
	},


	toggleStopwatch(){
		clearInterval(this.stopwatchInterval);
		if (this.stopwatchRunning) 
			this.stopwatchRunning = false;
		else {
			this.stopwatchInterval = setInterval(this.startStopwatch, 10);
			this.stopwatchRunning = true;
		}
	},
	startStopwatch() {
		stopwatchTens++; 

		var tempStopwatchTens = stopwatchTens;
		var tempStopwatchSeconds = stopwatchSeconds;
		var tempStopwatchMinutes = stopwatchMinutes;
		var tempStopwatchHours = stopwatchHours;

		stopwatchTens = tempStopwatchTens%100;
		tempStopwatchSeconds += tempStopwatchTens/100;
		stopwatchSeconds = Math.floor(tempStopwatchSeconds%60);
		tempStopwatchMinutes += tempStopwatchSeconds/60;
		stopwatchMinutes = Math.floor(tempStopwatchMinutes%60);
		tempStopwatchHours += tempStopwatchMinutes/60;
		stopwatchHours = Math.floor(tempStopwatchHours);

		document.getElementById("stopwatchTens").innerHTML = checkTime(stopwatchTens);
		document.getElementById("stopwatchSeconds").innerHTML = checkTime(stopwatchSeconds);
		document.getElementById("stopwatchMinutes").innerHTML = checkTime(stopwatchMinutes);
		document.getElementById("stopwatchHours").innerHTML = checkTime(stopwatchHours);

	},
	clearStopwatch(){
		clearInterval(this.stopwatchInterval);
		document.getElementById("stopwatchTens").innerHTML = "00";
		document.getElementById("stopwatchSeconds").innerHTML = "00";
		document.getElementById("stopwatchMinutes").innerHTML = "00";
		document.getElementById("stopwatchHours").innerHTML = "00";
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
					clearTimer();
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

