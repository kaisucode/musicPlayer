
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

	$('#Clock_menu').focus();

	// $('.clock').css('display', 'inline');
	$('.clock_group').css('display', 'none');
	// $('.timer').css('display', 'inline');
	$('.timer_group').css('display', 'none');
	$('.stopwatch_group').css('display', 'inline');
	// $('.stopwatch').css('display', 'none');
	
	$('#Clock_menu').click(function(){
		$('.timer_group').css('display', 'none');
		$('.clock_group').css('display', 'inline');
		$('.stopwatch_group').css('display', 'none');
	})

	$('#Timer_menu').click(function(){
		$('.clock_group').css('display', 'none');
		$('.timer_group').css('display', 'inline');
		$('.stopwatch_group').css('display', 'none');
	})

	$('#Stopwatch_menu').click(function(){
		$('.clock_group').css('display', 'none');
		$('.timer_group').css('display', 'none');
		$('.stopwatch_group').css('display', 'inline');
	})



	$('[role="menu"] button').keydown(function(e){
		var myIndex = $(this).parent().index();
		var mySibling = $(this).parents('[role="menu"]').children();
		var first = mySibling[0];
		var last = mySibling.get(-1);
		if (e.which === 37 || e.keyCode === 37){
			e.preventDefault();
			var prev = mySibling[myIndex - 1];
			if(prev){
				$(prev).children('button').focus();
			}else {
				$(last).children('button').focus();
			}
		}
		if (e.which === 39 || e.keyCode === 39){
			e.preventDefault();
			var next = mySibling[myIndex + 1];
			if(next){
				$(next).children('button').focus();
			}else {
				$(first).children('button').focus();
			}
		}
	});

});

