
var focusPage = {
	"clock": true, 
	"timer": false,
	"stopwatch": false
};

var Interval;
var stopwatchRunning;
var seconds;
var tens;
var appendTens;
var appendSeconds;


$(document).ready(function() {
	tens = 00; 
	seconds = 00; 
	minutes = 00;
	hours = 00;
	appendTens = document.getElementById("tens")
	appendSeconds = document.getElementById("seconds")
	appendMinutes = document.getElementById("minutes")
	appendHours = document.getElementById("hours")
	stopwatchRunning = false;

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
			$('.clock_group').css('display', 'inline');
			$('.timer_group').css('display', 'none');
			$('.stopwatch_group').css('display', 'none');
		}
		else if (focusPage["timer"]){
			$('.clock_group').css('display', 'none');
			$('.timer_group').css('display', 'inline');
			$('.stopwatch_group').css('display', 'none');
		}
		else if (focusPage["stopwatch"]){
			$('.clock_group').css('display', 'none');
			$('.timer_group').css('display', 'none');
			$('.stopwatch_group').css('display', 'inline');
		}
	}
	function moveClockAppRight() {
		if (focusPage["clock"]){
			focusPage["clock"] = false;
			focusPage["timer"] = true;
		}
		else if (focusPage["timer"]){
			focusPage["timer"] = false;
			focusPage["stopwatch"] = true;
		}
		else if (focusPage["stopwatch"]){
			focusPage["stopwatch"] = false;
			focusPage["clock"] = true;
		}
		refreshClockApp();
	}
	function moveClockAppLeft() {
		if (focusPage["clock"]){
			focusPage["clock"] = false;
			focusPage["stopwatch"] = true;
		}
		else if (focusPage["timer"]){
			focusPage["timer"] = false;
			focusPage["clock"] = true;
		}
		else if (focusPage["stopwatch"]){
			focusPage["stopwatch"] = false;
			focusPage["timer"] = true;
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

