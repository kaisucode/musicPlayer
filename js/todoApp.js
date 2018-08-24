 
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
		console.log(allText);
		return allText;
	},
	
	appInitialization(){
		byId('hw_content').innerText = this.readTextFile("data/todo/hw.txt");
		byId('cs_content').innerText = this.readTextFile("data/todo/cs.txt");
		byId('ee_content').innerText = this.readTextFile("data/todo/ee.txt");
		byId('art_content').innerText = this.readTextFile("data/todo/art.txt");
	}	

}

