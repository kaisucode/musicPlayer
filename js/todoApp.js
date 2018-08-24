 
var todoApp = {
	readTextFile(file){
		var allText;
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function (){
			if(rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0))
					allText = rawFile.responseText;
		}
		rawFile.send(null);
		// console.log(allText);
		return allText;
	},
	
	appInitialization(){
		// byId('hw_content').innerText = this.readTextFile("data/todo/hw.txt");
		byId('cs_content').innerText = this.readTextFile("data/todo/cs.txt");
		byId('ee_content').innerText = this.readTextFile("data/todo/ee.txt");
		byId('art_content').innerText = this.readTextFile("data/todo/art.txt");

		var hw_content = this.readTextFile("data/todo/hw.txt");
		var parsed_hw_content = hw_content.split("\n");

		var final_hw_content = [];
		var tempStr = "";
		var firstDay = true;
		var rightAfterHr = true;
		var daysOfTheWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

		parsed_hw_content.forEach(function(line){
			if (firstDay && line == "<hr>")
				firstDay = false;
			else if (line == "<hr>"){
				final_hw_content.push(tempStr);
				tempStr = "";
				rightAfterHr = true;
			}
			else if (rightAfterHr)
				rightAfterHr = false;
			else
				tempStr+=(line+"\n");
		});
		final_hw_content.push(tempStr);

		byId('hw_day').innerText = daysOfTheWeek[0];
		byId('hw_content').innerText = final_hw_content[0];
		var i = 1;
		var hw_content_length = final_hw_content.length;
		setInterval(function() {
			byId('hw_day').innerText = daysOfTheWeek[i];
			byId('hw_content').innerText = final_hw_content[i];
			(i >= hw_content_length-1) ? i=0 : i++;
		}, 1500);

	}	
}

