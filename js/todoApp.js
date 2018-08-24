 
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
		console.log(parsed_hw_content);
		var final_hw_content = [];
		var tempStr = "";
		parsed_hw_content.forEach(function(line){
			if (line == ""){
				tempStr+="\n";
				final_hw_content.push(tempStr);
				tempStr = "";
			}
			else{
				tempStr+=(line+"\n");
			}
		});
		console.log(final_hw_content);

		byId('hw_content').innerText = final_hw_content[0];
		var i = 1;
		var hw_content_length = final_hw_content.length;
		setInterval(function() {
			byId('hw_content').innerText = final_hw_content[i];
			(i >= hw_content_length) ? i=0 : i++;
		}, 2000);

	}	
}

