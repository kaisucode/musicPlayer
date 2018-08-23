
inApp = {
	"time": false,
	"rov": false
};

apps = ["timeApp", "rovApp"];

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
	rovApp.appInitialization();

	document.addEventListener("keydown", function onEvent(event) {
		if (inApp["time"]){
			timeApp.behaviorDetermine();
		}
		else if (inApp["rov"]){
			rovApp.behaviorDetermine();
		}
		else if (event.key === "T"){
			inApp["time"] = true;
			startApp("timeApp");
			timeApp.refreshTimeApp();
		}
		else if (event.key === "m"){
			inApp["rov"] = true;
			startApp("rovApp");
		}
		else
			rovApp.outOfAppBehaviorDetermine();

	});
};
