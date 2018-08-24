
calendarApp = {
	currentDate : new Date(),

  generateCalendar(d) {
    function monthDays(month, year) {
      var result = [];
      var days = new Date(year, month, 0).getDate();
      for (var i = 1; i <= days; i++) 
        result.push(i);
      return result;
    }
    Date.prototype.monthDays = function() {
      var d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
      return d.getDate();
    };
    var details = {
      // totalDays: monthDays(d.getMonth(), d.getFullYear()),
      totalDays: d.monthDays(),
      weekDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    };
    var start = new Date(d.getFullYear(), d.getMonth()).getDay();
    var cal = [];
    var day = 1;
    for (var i = 0; i <= 6; i++) {
      cal.push(['<tr>']);
      for (var j = 0; j < 7; j++) {
        if (i === 0) 
          cal[i].push('<td>' + details.weekDays[j] + '</td>');
				else if (day > details.totalDays) 
          cal[i].push('<td>&nbsp;</td>');
				else {
          if (i === 1 && j < start) 
            cal[i].push('<td>&nbsp;</td>');
					else 
            cal[i].push('<td class="day">' + day++ + '</td>');
        }
      }
      cal[i].push('</tr>');
    }
    cal = cal.reduce(function(a, b) {
      return a.concat(b);
    }, []).join('');
    $('table').append(cal);
    $('#month').text(details.months[d.getMonth()]);
    $('#year').text(d.getFullYear());
    $('td.day').mouseover(function() {
      $(this).addClass('hover');
    }).mouseout(function() {
      $(this).removeClass('hover');
    });
  },



	resetMonth(){
		this.currentDate = new Date();
		this.generateCalendar(this.currentDate);
		this.previousMonth();
		this.nextMonth();
	},
	previousMonth(){
    $('table').text('');
    if (this.currentDate.getMonth() === 0) {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, 11);
      this.generateCalendar(this.currentDate);
    }
		else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1)
      this.generateCalendar(this.currentDate);
    }
	},
	nextMonth(){
    $('table').html('<tr></tr>');
    if (this.currentDate.getMonth() === 11) {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0);
      this.generateCalendar(this.currentDate);
    }
		else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1)
      this.generateCalendar(this.currentDate);
    }
	},
	
	appInitialization(){
		var currentDate = new Date();
		calendarApp.generateCalendar(currentDate);
	},

	behaviorDetermine(){
		if (event.which === 37)					// Left arrow
			this.previousMonth();
		else if (event.which === 39)					// Right arrow
			this.nextMonth();
		else if (event.key === "c")					// Right arrow
			this.resetMonth();
		else if (event.key === "q") {		// Quit
			inApp["calendar"] = false;
			stopApp("calendarApp");
		}
	}
}


