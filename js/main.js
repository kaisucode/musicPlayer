
$(document).ready(function() {
	var focusPage = {
		"clock": true, 
		"timer": false,
		"stopwatch": false
	};
	$("#clockButton").addClass("clockAppButtonSelected");
	var Interval;
	var tens = 00; 
	var seconds = 00; 
	var minutes = 00;
	var hours = 00;
	var appendTens = document.getElementById("tens")
	var appendSeconds = document.getElementById("seconds")
	var appendMinutes = document.getElementById("minutes")
	var appendHours = document.getElementById("hours")
	var stopwatchRunning = false;

	startTime();
	refreshClockApp();

	document.addEventListener("keydown", function onEvent(event) {
		if (event.key === "q") 
			require('electron').remote.getCurrentWindow().close();
		else if (event.key === "s" && focusPage["stopwatch"]) 
			toggleStopwatch();
		else if (event.key === "c" && focusPage["stopwatch"])
			clearStopwatch();
		else if (event.which === 37)	// Left
			moveClockAppLeft();
		else if (event.which === 39)	//Right arrow
			moveClockAppRight();
	});

	function startTime() {
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

		var t = setTimeout(startTime, 500);

		function checkTime(i) {
			return ( i<10 ? "0"+i : i );
		}
	}
	function refreshClockApp() {
		if (focusPage["clock"]){
			$('.clockGroup').css('display', 'inline');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'none');
		}
		else if (focusPage["timer"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'inline');
			$('.stopwatchGroup').css('display', 'none');
		}
		else if (focusPage["stopwatch"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'inline');
		}
	}
	function moveClockAppRight() {
		if (focusPage["clock"]){
			focusPage["clock"] = false;
			focusPage["timer"] = true;
			$("#clockButton").removeClass("clockAppButtonSelected");
			$("#timerButton").addClass("clockAppButtonSelected");
		}
		else if (focusPage["timer"]){
			focusPage["timer"] = false;
			focusPage["stopwatch"] = true;
			$("#timerButton").removeClass("clockAppButtonSelected");
			$("#stopwatchButton").addClass("clockAppButtonSelected");
		}
		else if (focusPage["stopwatch"]){
			focusPage["stopwatch"] = false;
			focusPage["clock"] = true;
			$("#stopwatchButton").removeClass("clockAppButtonSelected");
			$("#clockButton").addClass("clockAppButtonSelected");
		}
		refreshClockApp();
	}
	function moveClockAppLeft() {
		if (focusPage["clock"]){
			focusPage["clock"] = false;
			focusPage["stopwatch"] = true;
			$("#clockButton").removeClass("clockAppButtonSelected");
			$("#stopwatchButton").addClass("clockAppButtonSelected");
		}
		else if (focusPage["timer"]){
			focusPage["timer"] = false;
			focusPage["clock"] = true;
			$("#timerButton").removeClass("clockAppButtonSelected");
			$("#clockButton").addClass("clockAppButtonSelected");
		}
		else if (focusPage["stopwatch"]){
			focusPage["stopwatch"] = false;
			focusPage["timer"] = true;
			$("#stopwatchButton").removeClass("clockAppButtonSelected");
			$("#timerButton").addClass("clockAppButtonSelected");
		}
		refreshClockApp();
	}
	function toggleStopwatch(){
		clearInterval(Interval);
		if (stopwatchRunning) 
			stopwatchRunning = false;
		else {
			Interval = setInterval(startStopwatch, 10);
			stopwatchRunning = true;
		}
	}
	function startStopwatch () {
		tens++; 
		
		if(tens < 9)
			appendTens.innerHTML = "0" + tens;
		else if (tens > 99) {
			console.log("seconds");
			seconds++;
			appendSeconds.innerHTML = "0" + seconds;
			tens = 0;
			appendTens.innerHTML = "0" + 0;
		} 
		else if (tens > 9)
			appendTens.innerHTML = tens;
		
		if (seconds > 59){
			minutes++;
			appendMinutes.innerHTML = "0" + minutes;
			seconds = 0;
			appendSeconds.innerHTML = "0" + 0;
		}
		else if (seconds > 9)
			appendSeconds.innerHTML = seconds;

		if (minutes > 59){
			hours++;
			appendHours.innerHTML = "0" + hours;
			minutes = 0;
			appendMinutes.innerHTML = "0" + 0;
		}
		else if (minutes > 9)
			appendMinutes.innerHTML = minutes;

		if (hours > 9)
			appendHours.innerHTML = hours;
	}
	function clearStopwatch(){
		clearInterval(Interval);
		appendTens.innerHTML = "00";
		appendSeconds.innerHTML = "00";
		appendMinutes.innerHTML = "00";
		appendHours.innerHTML = "00";
		stopwatchRunning = false;
	}

});

