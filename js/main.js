
var focus_menu = 0;
// [clock, timer, stopwatch]

document.addEventListener("keypress", function onEvent(event) {
	// Close electron on 'q'
	if (event.key === "q") {
		const remote = require('electron').remote
		let w = remote.getCurrentWindow()
		w.close()
	} else if (event.key === "s" && focus == 2) {
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
	} else if (event.key === "c" && focus == 2){
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

	$('.clock_group').css('display', 'inline');
	// $('.clock_group').css('display', 'none');
	// $('.timer_group').css('display', 'inline');
	$('.timer_group').css('display', 'none');
	// $('.stopwatch_group').css('display', 'inline');
	$('.stopwatch_group').css('display', 'none');
	
	$('#Clock_menu').on("focus", function(){
		$('.timer_group').css('display', 'none');
		$('.clock_group').css('display', 'inline');
		$('.stopwatch_group').css('display', 'none');
		focus = 0;
	});

	$('#Timer_menu').on("focus", function(){
		$('.clock_group').css('display', 'none');
		$('.timer_group').css('display', 'inline');
		$('.stopwatch_group').css('display', 'none');
		focus = 1;
	});

	$('#Stopwatch_menu').on("focus", function(){
		$('.clock_group').css('display', 'none');
		$('.timer_group').css('display', 'none');
		$('.stopwatch_group').css('display', 'inline');
		focus = 2;
	});



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

