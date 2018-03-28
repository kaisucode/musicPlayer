
// Close electron on 'q'
document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "q") {
		const remote = require('electron').remote
		let w = remote.getCurrentWindow()
		w.close()
    }
});

$(document).ready(function() {

	$('.clock').css('display', 'inline');
	$('.timer').css('display', 'none');
	$('.stopwatch').css('display', 'none');
	
	$('#Clock').click(function(){
		$('.timer').css('display', 'none');
		$('.clock').css('display', 'inline');
		$('.stopwatch').css('display', 'none');
	})

	$('#Timer').click(function(){
		$('.clock').css('display', 'none');
		$('.timer').css('display', 'inline');
		$('.stopwatch').css('display', 'none');
	})

	$('#Stopwatch').click(function(){
		$('.clock').css('display', 'none');
		$('.timer').css('display', 'none');
		$('.stopwatch').css('display', 'inline');
	})
});

