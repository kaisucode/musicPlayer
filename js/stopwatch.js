window.onload = function () {
	
	var seconds = 00; 
	var tens = 00; 
	var appendTens = document.getElementById("tens")
	var appendSeconds = document.getElementById("seconds")
	var buttonStartStop = document.getElementById('button-startstop');
	var buttonReset = document.getElementById('button-reset');
	var Interval;
	var start_stop = false;

	document.addEventListener("keypress", function onEvent(event) {
		if (event.key === "s") {
			if (start_stop) {
				clearInterval(Interval);
				start_stop = false;
			} else {
				clearInterval(Interval);
				Interval = setInterval(startStopwatch, 10);
				start_stop = true;
			}
		} else if (event.key === "c"){
			clearInterval(Interval);
			tens = "00";
			seconds = "00";
			appendTens.innerHTML = tens;
			appendSeconds.innerHTML = seconds;
		}
	});

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
}
