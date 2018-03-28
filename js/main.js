
document.addEventListener("keypress", function onEvent(event) {
	// Close electron on 'q'
	if (event.key === "q") {
		const remote = require('electron').remote
		let w = remote.getCurrentWindow()
		w.close()
	} else if (event.key === "s") {
			if (start_stop) {
				clearInterval(Interval);
				start_stop = false;
				$('#button-startstop').text('Start');

			} else {
				clearInterval(Interval);
				Interval = setInterval(startStopwatch, 10);
				start_stop = true;
				$('#button-startstop').text('Stop');
			}
	} else if (event.key === "c"){
		clearInterval(Interval);
		tens = "00";
		seconds = "00";
		appendTens.innerHTML = tens;
		appendSeconds.innerHTML = seconds;
		start_stop = false;
		$('#button-startstop').text('Start');
	}
});

$(document).ready(function() {
	startTime();

	// $('.clock').css('display', 'inline');
	$('.clock').css('display', 'none');
	// $('.timer').css('display', 'inline');
	$('.timer').css('display', 'none');
	$('.stopwatch').css('display', 'inline');
	// $('.stopwatch').css('display', 'none');
	
	$('#Clock_menu').click(function(){
		$('.timer').css('display', 'none');
		$('.clock').css('display', 'inline');
		$('.stopwatch').css('display', 'none');
	})

	$('#Timer_menu').click(function(){
		$('.clock').css('display', 'none');
		$('.timer').css('display', 'inline');
		$('.stopwatch').css('display', 'none');
	})

	$('#Stopwatch_menu').click(function(){
		$('.clock').css('display', 'none');
		$('.timer').css('display', 'none');
		$('.stopwatch').css('display', 'inline');
	})
});

