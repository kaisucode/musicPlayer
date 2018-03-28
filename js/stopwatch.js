
var Interval;
var start_stop;
var seconds;
var tens;
var appendTens;
var appendSeconds;

window.onload = function () {
	seconds = 00; 
	tens = 00; 
	appendTens = document.getElementById("tens")
	appendSeconds = document.getElementById("seconds")
	start_stop = false;
}

function startStopwatch () {
	tens++; 
	
	if(tens < 9){
		appendTens.innerHTML = "0" + tens;
	}
	
	if (tens > 9){
		appendTens.innerHTML = tens;
	} 
	
	if (tens > 99) {
		console.log("seconds");
		seconds++;
		appendSeconds.innerHTML = "0" + seconds;
		tens = 0;
		appendTens.innerHTML = "0" + 0;
	}
	
	if (seconds > 9){
		appendSeconds.innerHTML = seconds;
	}
}
