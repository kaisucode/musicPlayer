
inApp = {
	"time": false,
	"rov": false
};

apps = ["timeApp", "rovApp", "todoApp"];

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
	todoApp.appInitialization();

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
		else if (event.key === "u"){
			function readTextFile(file){
				var rawFile = new XMLHttpRequest();
				rawFile.open("GET", file, false);
				rawFile.onreadystatechange = function (){
					if(rawFile.readyState === 4){
						if(rawFile.status === 200 || rawFile.status == 0){
							var allText = rawFile.responseText;
							console.log(allText);
							alert(allText);
						}
					}
				}
				rawFile.send(null);
			}
			readTextFile("README.txt");
		}
		else
			rovApp.outOfAppBehaviorDetermine();

	});
};
