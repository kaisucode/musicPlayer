
function fandomAppSleepCommand(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function fandomAppSleep() {
  await fandomAppSleepCommand(3000);
	fandomApp.appInitialization2();
}

fandomApp = {
	

	slideIndex : 0,
	numOfImgs : 0,
	fandomImages : [],

	loadLibrary(){
		$.getJSON( "data/fandomImgList.json", function( data ) {
			$.each( data, function( key, val ) {
				fandomApp.fandomImages.push(val);
				fandomApp.numOfImgs++;
			});
		});
	},

	appInitialization(){
		this.loadLibrary();
		$("#fandom_container").html("<img src='data/fandom/life motto.jpeg'/>");
		fandomAppSleep();
	},
	appInitialization2(){
		console.log(this.fandomImages);
		this.showSlides();
	},

	showSlides() {
    if (fandomApp.slideIndex >= fandomApp.numOfImgs-1)
			fandomApp.slideIndex = 0;
    $("#fandom_container").html("<img src='data/fandom/"+fandomApp.fandomImages[fandomApp.slideIndex]+"'/>");
    fandomApp.slideIndex++;
    setTimeout(fandomApp.showSlides, 3000); // Change image every 2 seconds
	}
}

