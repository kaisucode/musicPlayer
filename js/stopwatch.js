
var Interval;
var start_stop;
var seconds;
var tens;
var appendTens;
var appendSeconds;

window.onload = function () {
	tens = 00; 
	seconds = 00; 
	minutes = 00;
	hours = 00;
	appendTens = document.getElementById("tens")
	appendSeconds = document.getElementById("seconds")
	appendMinutes = document.getElementById("minutes")
	appendHours = document.getElementById("hours")
	start_stop = false;
}

function startStopwatch () {
	tens++; 
	// seconds+=100; 
	
	if(tens < 9){
		appendTens.innerHTML = "0" + tens;
	} else if (tens > 99) {
		console.log("seconds");
		seconds++;
		appendSeconds.innerHTML = "0" + seconds;
		tens = 0;
		appendTens.innerHTML = "0" + 0;
	} else if (tens > 9){
		appendTens.innerHTML = tens;
	}
	
	if (seconds > 59){
		minutes++;
		appendMinutes.innerHTML = "0" + minutes;
		seconds = 0;
		appendSeconds.innerHTML = "0" + 0;
	}else if (seconds > 9){
		appendSeconds.innerHTML = seconds;
	}

	if (minutes > 59){
		hours++;
		appendHours.innerHTML = "0" + hours;
		minutes = 0;
		appendMinutes.innerHTML = "0" + 0;
	}else if (minutes > 9){
		appendMinutes.innerHTML = minutes;
	}

	if (hours > 9){
		appendHours.innerHTML = hours;
	}

}

