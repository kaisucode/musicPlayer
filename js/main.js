
inApp = {
	"time": false,
	"music": false,
	"calendar": false
};

apps = ["timeApp", "musicApp", "todoApp", "calendarApp", "fandomApp", "decorationsApp"];

function stopApp(appName){
	$("#"+appName).removeClass(appName+"Start");
	$("#"+appName).addClass(appName);
	apps.forEach(function(app){
		if (app!=appName)
			$("#"+app).css("display", "block");
	});
}
function startApp(appName){
	$("#"+appName).removeClass(appName);
	$("#"+appName).addClass(appName+"Start");
	apps.forEach(function(app){
		if (app!=appName)
			$("#"+app).css("display", "none");
	});
}


window.onload = function (){

	timeApp.startTime();
	musicApp.appInitialization();
	todoApp.appInitialization();
	calendarApp.appInitialization();
	fandomApp.appInitialization();
	// var messenger = new Messenger($('#kaisu'), ["KAISU", "KEVIN"]);
	// var messenger2 = new Messenger($('#shadowsinger'), ["SHADOWSINGER", "HSU"]);
	var messenger = new Messenger($('#kaisu'), ["KAISU", "KAISU"]);
	var messenger2 = new Messenger($('#shadowsinger'), ["SHADOWSINGER", "SHADOWSINGER"]);

	document.addEventListener("keydown", function onEvent(event) {
		if (inApp["time"]){
			timeApp.behaviorDetermine();
		}
		else if (inApp["music"]){
			musicApp.behaviorDetermine();
		}
		else if (inApp["calendar"]){
			calendarApp.behaviorDetermine();
		}
		else if (event.key === "T"){
			todoApp.appInitialization();
		}
		else if (event.key === "t"){
			inApp["time"] = true;
			startApp("timeApp");
			timeApp.refreshTimeApp();
		}
		else if (event.key === "m"){
			inApp["music"] = true;
			startApp("musicApp");
		}
		else if (event.key === "c"){
			inApp["calendar"] = true;
			startApp("calendarApp");
		}
		else
			musicApp.outOfAppBehaviorDetermine();

	});
};
