
inApp = {
	"time": false
};

$(document).ready(function() {
	var stopwatchInterval;
	var stopwatchTens = 00; 
	var stopwatchSeconds = 00; 
	var stopwatchMinutes = 00;
	var stopwatchHours = 00;
	var appendStopwatchTens = document.getElementById("stopwatchTens");
	var appendStopwatchSeconds = document.getElementById("stopwatchSeconds");
	var appendStopwatchMinutes = document.getElementById("stopwatchMinutes");
	var appendStopwatchHours = document.getElementById("stopwatchHours");
	var stopwatchRunning = false;

	var timerInterval;
	var timerSeconds = 0; 
	var timerMinutes = 0;
	var timerHours = 0;
	var appendTimerSeconds = document.getElementById("timerSeconds");
	var appendTimerMinutes = document.getElementById("timerMinutes");
	var appendTimerHours = document.getElementById("timerHours");
	var timerRunning = false;
	var timerActivated = false;


	var focusPage = {
		"clock": true, 
		"timer": false,
		"stopwatch": false
	};
	$("#clockButton").addClass("clockAppButtonSelected");

	startTime();

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
			refreshClockApp();
			$(".inputTimer").css("display", "block", "important");
			function activateTimerInput(){
				if (timerSeconds === 0 && timerMinutes === 0 && timerHours === 0){
					$(".showTimer").css("display", "none", "important");
					$(".inputTimer").css("display", "block", "important");
				}	
			}
		}
		else if (inApp["time"]){
			if (event.key === "s" && focusPage["stopwatch"]) 
				toggleStopwatch();
			else if (event.key === "c" && focusPage["stopwatch"])
				clearStopwatch();

			else if (focusPage["timer"]){
				if (event.key === "s") 
					toggleTimer();
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
				moveClockAppLeft();
			else if (event.which === 39)	//Right arrow
				moveClockAppRight();
		}
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
			$('.clockGroup').css('display', 'block');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'none');
		}
		else if (focusPage["timer"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'block');
			$('.stopwatchGroup').css('display', 'none');
			// activateTimerInput();
		}
		else if (focusPage["stopwatch"]){
			$('.clockGroup').css('display', 'none');
			$('.timerGroup').css('display', 'none');
			$('.stopwatchGroup').css('display', 'block');
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







	function toggleTimer(){
		clearInterval(timerInterval);
		if (timerRunning) 
			timerRunning = false;
		else {
			// if (timerSeconds === 0 && timerMinutes === 0 && timerHours === 0){
			console.log("hai");
			console.log(timerActivated);
			if (timerActivated === false){
				timerSeconds = $("#timerSecondsInput").val(); 
				timerMinutes = $("#timerMinutesInput").val();
				timerHours = $("#timerHoursInput").val();
				appendTimerSeconds.innerHTML = checkTime(timerSeconds);
				appendTimerMinutes.innerHTML = checkTime(timerMinutes);
				appendTimerHours.innerHTML = checkTime(timerHours);

				timerActivated = true;
				$(".inputTimer").addClass("timerActivated");
			}
			timerInterval = setInterval(startTimer, 1000);
			timerRunning = true;
		}
		function checkTime(i) {
			return ( i<10 ? "0"+i : i );
		}
	}
	function startTimer () {
		if (timerSeconds <= 0 && timerMinutes <= 0 && timerHours <= 0){
			timerActivated = false;
			timerRunning = false;
			$(".inputTimer").addClass("timerSetup");
			clearTimer();
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

		function checkTime(i) {
			return ( i<10 ? "0"+i : i );
		}
	}
	function clearTimer(){
		clearInterval(timerInterval);
		appendTimerSeconds.innerHTML = "00";
		appendTimerMinutes.innerHTML = "00";
		appendTimerHours.innerHTML = "00";
		timerRunning = false;
	}













	function toggleStopwatch(){
		clearInterval(stopwatchInterval);
		if (stopwatchRunning) 
			stopwatchRunning = false;
		else {
			stopwatchInterval = setInterval(startStopwatch, 10);
			stopwatchRunning = true;
		}
	}
	function startStopwatch () {
		stopwatchTens++; 
		
		if(stopwatchTens < 9)
			appendStopwatchTens.innerHTML = "0" + stopwatchTens;
		else if (stopwatchTens > 99) {
			stopwatchSeconds++;
			appendStopwatchSeconds.innerHTML = "0" + stopwatchSeconds;
			stopwatchTens = 0;
			appendStopwatchTens.innerHTML = "00";
		} 
		else if (stopwatchTens > 9)
			appendStopwatchTens.innerHTML = stopwatchTens;
		
		if (stopwatchSeconds > 59){
			stopwatchMinutes++;
			appendStopwatchMinutes.innerHTML = "0" + stopwatchMinutes;
			stopwatchSeconds = 0;
			appendStopwatchSeconds.innerHTML = "00";
		}
		else if (stopwatchSeconds > 9)
			appendStopwatchSeconds.innerHTML = stopwatchSeconds;

		if (stopwatchMinutes > 59){
			stopwatchHours++;
			appendStopwatchHours.innerHTML = "0" + stopwatchHours;
			stopwatchMinutes = 0;
			appendStopwatchMinutes.innerHTML = "00";
		}
		else if (stopwatchMinutes > 9)
			appendStopwatchMinutes.innerHTML = stopwatchMinutes;

		if (stopwatchHours > 9)
			appendStopwatchHours.innerHTML = stopwatchHours;
	}
	function clearStopwatch(){
		clearInterval(stopwatchInterval);
		appendStopwatchTens.innerHTML = "00";
		appendStopwatchSeconds.innerHTML = "00";
		appendStopwatchMinutes.innerHTML = "00";
		appendStopwatchHours.innerHTML = "00";
		stopwatchRunning = false;
	}

});

