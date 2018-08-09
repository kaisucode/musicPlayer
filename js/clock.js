

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
}

function checkTime(i) {
	if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
}


