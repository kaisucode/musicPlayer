
var audio, audioStream, analyser, source, audioCtx, canvasCtx, frequencyData;
var cursorOnIndex = 0;

function getCursorOnSongID(){
	return musicApp.songOrder[cursorOnIndex];
}


canvas = document.getElementById("music_canvas");
var musicApp = {
	ctx : canvas.getContext('2d'),

	animation_size : 1,
	stars : [], stars2 : [],	// Array that contains the stars
	FPS : 60,									// Frames per second
	numOfStars : 40,					// Number of stars

	nowPlaying : [],
	library : [],

	songOrder : [],
	setVolume : 1.0,
	lastPlayed : 0,
	musicIndex : 0,

	initialSelect : 0,
	lastSelect : 0,
	lastKey : -1,
	clipboard : [],
	lowerLoopLimit : 0,
	upperLoopLimit : 0,
	keyDownPressed : false,
	immediatelyAfterSelectAll : false,
	firstTimeAfterLoop : false,

	loopStyle : {
		"default": true, 
		"single": false,
		"multi": false
	},

	mode : {
		"normal": true, 
		"enter": false,
		"search": false,
		"select": false
	},






	/***	Graphics	***/
	createStars(){
		for (var i = 0; i < this.numOfStars; i++) {
			this.stars.push({
				x: (i*8+10)*this.animation_size,
				y: 350,
				radius: Math.random() * 1 + 2,
			});
			this.stars2.push({
				x: (i*8+10)*this.animation_size,
				y: 350,
			});
		}
	},

	draw(){
		this.ctx.clearRect(0,0,canvas.width,canvas.height);
		this.ctx.globalCompositeOperation = "lighter";

		for (var i = 1, x = this.stars.length-1; i < x; i+=5) {
			var s = this.stars[i];
			this.ctx.beginPath();
			this.ctx.fillStyle = "#00FFF2";
			this.ctx.lineWidth = 0.08;
			this.ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
			this.ctx.fill();
			this.ctx.stroke();

			this.ctx.shadowColor = '#7DF9FF';
			this.ctx.shadowBlur = 10;
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;
			this.ctx.stroke();
			this.ctx.fill();
		}

		this.ctx.beginPath();
		for (var i = this.stars.length-1; i > 0; i--){
			this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
			this.ctx.lineTo(this.stars[i-1].x, this.stars[i-1].y);
			this.ctx.lineWidth = 2;
			this.ctx.lineWidth = 3;
			this.ctx.strokeStyle = '#3ECAE8';

			this.ctx.shadowColor = '#fff';
			this.ctx.shadowBlur = 10;
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;
			}
		this.ctx.stroke();

		this.ctx.beginPath();
		for (var i = this.stars.length-1; i > 0; i--){
			this.ctx.moveTo(this.stars2[i].x, this.stars2[i].y);
			this.ctx.lineTo(this.stars2[i-1].x, this.stars2[i-1].y);
			this.ctx.lineWidth = 0.5;
			this.ctx.lineWidth = 0.8;
			this.ctx.strokeStyle = 'rgb(97.3%, 82.4%, 82.4%)';

			this.ctx.shadowColor = '#6e529b';
			this.ctx.shadowBlur = 10;
			this.ctx.shadowOffsetX = 0;
			this.ctx.shadowOffsetY = 0;
		}
		this.ctx.stroke();
	},
	updateStarLocations(dataArray){
		for (var i = 0, x = this.stars.length; i < x; i++) {
			var s = this.stars[i];
			s.y = (-((dataArray[i*4]-180) * 40) / this.FPS + 110)*this.animation_size;		// 50~470
			if (s.y < 38) s.y = 38;

			var s2 = this.stars2[i];
			s2.y = (-((dataArray[(i+1)*3]-320) * 24) / this.FPS+65)*this.animation_size;
			if (s2.y < 38) s2.y = 38;
		}
	},
	toggleView(){
		if (this.animation_size === 1){
			this.animation_size = 3;
			$(".music_equalizer_container").css("right", "17vh");
		}
		else if (this.animation_size === 3){
			this.animation_size = 1;
			$(".music_equalizer_container").css("right", "0vh");
		}

		canvas.width = 365*this.animation_size;
		canvas.height = 280*this.animation_size;
		for (var i = 0, x = this.stars.length; i < x; i++) {
			this.stars[i].x = (i*8+10)*this.animation_size;
			this.stars2[i].x = (i*8+10)*this.animation_size;
		}
	},
	/***	Graphics	***/



	/***	Helper	***/
	isNotPlaylist(filename){
		return (filename.slice(-5) != ".json");
	},
	nameInLibrary(songName){
		return $.inArray(songName, this.library) != -1;	
	},
	/***	Helper	***/



	loadLibrary(){
		$.getJSON( "data/library.json", function( data ) {
			$.each( data, function( key, val ) {
				if (musicApp.isNotPlaylist(val))
					musicApp.library.push(val.slice(0, -4));
				else
					musicApp.library.push(val);
			});
		});
	},
	appInitialization(){
		this.ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
		canvas.width = 365*this.animation_size;
		canvas.height = 280*this.animation_size;

		this.createStars();
		this.loadLibrary();
		this.setMode("normal");
		this.setAutocomplete(this.library);
	},



	init(){
		this.audio = new Audio('data/mp3/'+this.nowPlaying[this.musicIndex]+".mp3");
		this.audio.addEventListener('ended', function(){
			musicApp.changeMusicIndex(1);
			musicApp.loadNextTrack();
			return;
		})

		this.audio.play();
		$("#music_currentSongText").text(this.nowPlaying[this.musicIndex]);
		$("#music_currentSongText").css("animation-duration", (this.nowPlaying[this.musicIndex].length+5)+"s");
		$(this.songOrder[this.lastPlayed]+" div:nth-child(1)").css("display", "none");
		$(this.songOrder[this.lastPlayed]+" div:nth-child(2)").css("margin-left", "+=30");
		this.lastPlayed = this.musicIndex;
		$(this.songOrder[this.musicIndex]+" div:nth-child(1)").css("display", "inline-block");
		$(this.songOrder[this.musicIndex]+" div:nth-child(2)").css("margin-left", "0");
		this.audio.volume = this.setVolume;

		try {
			audioCtx = new AudioContext();
			analyser = audioCtx.createAnalyser();
		} catch (e) {}
		source = audioCtx.createMediaElementSource(this.audio);
		source.connect(analyser);
		analyser.connect(audioCtx.destination);
		analyser.fftSize = 4096;
		frequencyData = new Uint8Array(analyser.frequencyBinCount);
	},

	renderFrame(){
		analyser.getByteFrequencyData(frequencyData);		// 0~255
		musicApp.draw();
		musicApp.updateStarLocations(frequencyData);

		requestAnimationFrame(musicApp.renderFrame);
	},

	loadNextTrack(){
		this.init();
		this.renderFrame();
	},


	setMode(newMode){
		for (var key in this.mode)
			this.mode[key] = false;
		this.mode[newMode] = true;

		this.lastKey = -1;
		if (this.mode["normal"]){
			$("#unfocus").focus(); 
			this.setAutocomplete(this.library);
			this.removeAllSelect();
		}
		else if (this.mode["enter"]){
			event.preventDefault();
			$("#songInput").focus();
			this.setAutocomplete(this.library);
		}
		else if (this.mode["search"]){
			event.preventDefault();
			$("#songInput").focus();
			this.setAutocomplete(this.nowPlaying);
		}
		else if (this.mode["select"]){
			$("#unfocus").focus(); 
			this.setAutocomplete(this.library);
			this.startSelectMode();
		}

		$("#music_lightline").removeClass(this.lastMode+"Mode");
		$("#music_lightline").addClass(newMode+"Mode");
		$(".music_info").text(newMode.toUpperCase());
		this.lastMode = newMode;
	},

	setAutocomplete(datalist){
		$( "#songInput" ).autocomplete({
			source: datalist
		});
	},


	selectAll(){
		event.preventDefault();
		this.moveCursorToFirst();
		this.setMode("select");
		this.moveCursorToLast();
		this.lastSelect = this.nowPlaying.length;
		this.immediatelyAfterSelectAll = true;
	},

	getHeight(temp_id){
		return ($(temp_id).offset().top - $(window).scrollTop());
	},

	moveCursor(sign){
		if (typeof this.moveCursor.cursorLastOn == 'undefined')
			this.moveCursor.cursorLastOn = "#song0";
		cursorOnIndex += sign;
		if (cursorOnIndex < 0)
			cursorOnIndex = 0;
		else if (cursorOnIndex > this.nowPlaying.length-1)
			cursorOnIndex = this.nowPlaying.length-1;
		$(this.moveCursor.cursorLastOn).removeClass("focusedBox");
		$(getCursorOnSongID()).addClass("focusedBox");
		this.moveCursor.cursorLastOn = getCursorOnSongID();
	},

	changeVolume(sign){
		if (sign === 1 && this.audio.volume >= 0.9)
			this.audio.volume = 1.0;
		else if (sign === -1 && this.audio.volume <= 0.1)
			this.audio.volume = 0.0;
		else if (sign === 1 && this.audio.volume < 1)
			this.audio.volume = this.setVolume+0.1;
		else if (sign === -1 && this.audio.volume > 0)
			this.audio.volume = this.setVolume-0.1;
		this.setVolume = this.audio.volume;
	},











	genNewLi(songName, index){
		if (typeof this.genNewLi.count == 'undefined')
			this.genNewLi.count = 0;
		var ul = document.getElementById("music_nextUpList");
		var li = document.createElement("li");
		var arrowdiv = document.createElement("div");
		arrowdiv.appendChild(document.createTextNode("> "));
		arrowdiv.setAttribute("class", "arrow");
		li.appendChild(arrowdiv);
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(songName));
		li.appendChild(div);
		li.setAttribute("id", "song"+this.genNewLi.count);
		li.setAttribute("tabindex", "-1");
		if (index === -1){
			ul.appendChild(li);
			this.songOrder.push("#song"+genNewLi.count);
		}
		else{
			index++;
			ul.insertBefore(li, ul.children[index]);
			this.songOrder.splice(index, 0, "#song"+this.genNewLi.count);
			this.nowPlaying.splice(index, 0, songName);
		}
		this.genNewLi.count++;
	},

	shiftPage(sign){
		try {
			if (sign === 1 && this.getHeight(getCursorOnSongID()) > this.getHeight(".music_scrollBox")+$(".music_scrollBox").height())
				$(getCursorOnSongID())[0].scrollIntoView(false);
			else if (sign === -1 && this.getHeight(getCursorOnSongID()) < this.getHeight(".music_scrollBox"))
				$(getCursorOnSongID())[0].scrollIntoView(true);
			else
				return;
		} 
		catch (e) {return;}
	},

	moveCursorDown(){
		if (this.immediatelyAfterSelectAll){
			this.initialSelect = this.nowPlaying.length-1;
			this.lastSelect = 0;
			this.immediatelyAfterSelectAll = false;
			this.moveCursorToFirst();
		}
		this.moveCursor(1);
		this.shiftPage(1);

		if (this.mode["select"] && cursorOnIndex-1 != this.initialSelect && this.lastSelect <= this.initialSelect)
			this.removePreviousFromSelect(cursorOnIndex-1);
		else if (this.mode["select"])
			this.addToSelect();
	},
	moveCursorUp(){
		if (this.immediatelyAfterSelectAll)
			this.immediatelyAfterSelectAll = false;
		this.moveCursor(-1);
		this.shiftPage(-1);

		if (this.mode["select"] && cursorOnIndex+1 != this.initialSelect && this.lastSelect >= this.initialSelect)
			this.removePreviousFromSelect(cursorOnIndex+1);
		else if (this.mode["select"])
			this.addToSelect();
	},
	centerCursor(){
		if (cursorOnIndex < this.nowPlaying.length-4)
			$(this.songOrder[cursorOnIndex+3])[0].scrollIntoView(false);
	},

	deleteCursorOnSong(){
		if (this.nowPlaying.length === 1){
			this.audio.pause();
			cursorOnIndex = 0;
			this.musicIndex = 0;
			$("#music_currentSongText").text("Rainbow of Velaris");
		}
		$(getCursorOnSongID()).remove();

		if (cursorOnIndex === this.nowPlaying.length-1)
			this.nowPlaying.splice(this.nowPlaying.length-1, 1);
		else
			this.nowPlaying.splice(cursorOnIndex, 1);
		this.songOrder.splice(cursorOnIndex, 1);

		this.refreshCursor();
		if (this.musicIndex < cursorOnIndex){					// Currently playing on before deleted
		}
		else if (this.afterCurrentlyPlaying()){			// Currently playing on after deleted
			this.changeMusicIndex(-1);
			this.lastPlayed--;
		}
		else if (this.musicIndex === cursorOnIndex){		// Currently playing was on deleted
			this.changeMusicIndex(0);
			this.skipToNextTrack();
		}
	},

	clearAll(){
		this.setLoop("single");
		this.moveCursorToFirst();
		var totalSongs = this.nowPlaying.length
		for (var i = 0; i < totalSongs; i++)
			this.deleteCursorOnSong();
	},

	pasteFromClipboard(){
		for (var i = 0; i < this.clipboard.length; i++)
			this.genNewLi(this.clipboard[i], cursorOnIndex+i);
		if (cursorOnIndex < this.musicIndex){
			var amount = this.clipboard.length;
			this.musicIndex+=amount;
			this.lastPlayed+=amount;
		}
	},

	copyCursorOnSong(){
		this.clipboard = [];
		this.clipboard.push($(getCursorOnSongID()).text().slice(2));
	},
	cutCursorOnSong(){
		this.copyCursorOnSong();
		this.deleteCursorOnSong();
	},

	copySelectedSongs(){
		this.clipboard = [];
		for (var i = -1; i < (this.getSelectEnd()-this.getSelectStart()); i++)
			this.clipboard.push($(this.songOrder[cursorOnIndex+i]).text().slice(2));
	},

	deleteSelectedSongs(){
		var numOfSongsSelected = Math.abs(this.initialSelect-this.lastSelect)+1;
		this.moveCursorToSelectStart();
		this.removeAllSelect();
		for (var i = 0; i < numOfSongsSelected; i++)
			this.deleteCursorOnSong();
	},

	cutSelectedSongs(){
		this.copySelectedSongs();
		this.deleteSelectedSongs();
	},

	enterInput(){
		var tempSongName = $("#songInput").val();
		var autoplay = (this.nowPlaying.length === 0);
		var originally0 = this.nowPlaying.length === 0;

		if (tempSongName.indexOf("*") != -1)
			this.wildcardInput(tempSongName, originally0);
		else if (this.nameInLibrary(tempSongName)){
			if (tempSongName.slice(-5) === ".json"){		// Playlists
				var i = 0;
				$.getJSON( "data/playlists/"+tempSongName, function( data ) {
					$.each( data, function( key, val ) {
						if (val!=""){
							musicApp.genNewLi(val.slice(0, -4), cursorOnIndex+i);
							i++;
						}
					});
					if (musicApp.afterCurrentlyPlaying() && !originally0){
						musicApp.changeMusicIndex(i);
						originally0 = false;
					}
					else if (originally0){
						musicApp.refreshCursor();
					}
				});
			}
			else{	// Songs
				this.genNewLi(tempSongName, cursorOnIndex);
				this.refreshCursor();
			}
		}
		if (autoplay)
			setTimeout(function() {musicApp.loadNextTrack();}, 100);
		$("#songInput").val("");
		$("#unfocus").focus();
	},

	searchInput(){
		var tempSongName = $("#songInput").val();
		var index = $.inArray(tempSongName, this.nowPlaying);
		if (index != -1){
			while(cursorOnIndex != index)
				this.moveCursor(cursorOnIndex > index ? -1 : 1);
			this.refreshCursor();
			this.centerCursor();
		$("#songInput").val("");
		$("#unfocus").focus();
		}
	},

	skipToSection(numWord){
		var num = parseInt(numWord);
		if (num === 0)
			num = 10;
		this.audio.currentTime = this.audio.duration*(num-1)/10;
	},

	nextSong(){
		if (this.loopStyle["single"]){
			$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").removeClass("loopedBox");
			this.changeMusicIndex(1);
			$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").addClass("loopedBox");
		}
		else if (this.firstTimeAfterLoop)
			this.firstTimeAfterLoop = false;
		else
			this.changeMusicIndex(1);
		this.skipToNextTrack();
	},

	previousSong(){
		if (this.loopStyle["single"]){
			$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").removeClass("loopedBox");
			this.changeMusicIndex(-1);
			$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").addClass("loopedBox");
			this.skipToNextTrack();
		}
		else
			this.changeMusicIndex(-1);
		this.skipToNextTrack();
	},

	skipToNextTrack(){
		this.audio.pause();
		this.loadNextTrack();
	},

	updateLoopLimits(newStyle){
		if (this.loopStyle["default"]){
			if (this.lowerLoopLimit === this.upperLoopLimit)
				$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").removeClass("loopedBox");
			else{
				for (var i = this.lowerLoopLimit; i < this.upperLoopLimit+1; i++)
					$(this.songOrder[i]+" div:nth-child(2)").removeClass("loopedBox");
			}
		}
		var loopLimits = {
			"default": [0, this.nowPlaying.length-1], 
			"single": [cursorOnIndex, cursorOnIndex],
			"multi": [this.getSelectStart(), this.getSelectEnd()]
		};
		this.lowerLoopLimit = loopLimits[newStyle][0];
		this.upperLoopLimit = loopLimits[newStyle][1];

		if (this.loopStyle["single"]){
			$(this.songOrder[this.lowerLoopLimit]+" div:nth-child(2)").addClass("loopedBox");
			this.musicIndex = this.lowerLoopLimit;
			// this.skipToNextTrack();
			this.firstTimeAfterLoop = true;
		}
		else if (this.loopStyle["multi"]){
			for (var i = this.lowerLoopLimit; i < this.upperLoopLimit+1; i++)
				$(this.songOrder[i]+" div:nth-child(2)").addClass("loopedBox");
			this.musicIndex = this.lowerLoopLimit;
			this.firstTimeAfterLoop = true;
			// this.skipToNextTrack();
		}
	},

	setLoop(newStyle){
		if (!this.loopStyle["default"])
			newStyle = "default";

		for (var key in this.loopStyle)
			this.loopStyle[key] = false;
		this.loopStyle[newStyle] = true;

		this.updateLoopLimits(newStyle);
	},

	changeMusicIndex(amount){
		this.musicIndex+=amount;

		if (this.loopStyle["default"] && (this.musicIndex < 0 || this.musicIndex > this.nowPlaying.length-1))
				this.musicIndex = 0;
		else if (this.loopStyle["single"])
			this.musicIndex = this.lowerLoopLimit;
		else if (this.loopStyle["multi"]){
			if(this.musicIndex < this.lowerLoopLimit || this.musicIndex > this.upperLoopLimit){
				this.musicIndex = this.lowerLoopLimit;
			}
		}
	},

	moveCursorToLast(){
		if (this.mode["select"]){
			this.removeAllSelect();
			for (var i = this.initialSelect; i < this.nowPlaying.length; i++)
				$(this.songOrder[i]+" div:nth-child(2)").addClass("selectionBox");
			this.lastSelect = this.nowPlaying.length-1;
		}
		while(cursorOnIndex < this.nowPlaying.length-1)
			this.moveCursor(1);
		this.refreshCursor();
	},

	moveCursorToFirst(){
		if (this.mode["select"]){
			this.removeAllSelect();
			for (var i = 0; i < this.initialSelect+1; i++)
				$(this.songOrder[i]+" div:nth-child(2)").addClass("selectionBox");
			this.lastSelect = 0;
		}
		while(cursorOnIndex > 0)
			this.moveCursor(-1);
		this.refreshCursor()
	},

	moveCursorToSelectStart(){
		var target = this.getSelectStart();
		var moveDirection = (cursorOnIndex > target) ? -1 : 1;
		while(cursorOnIndex != target)
			this.moveCursor(moveDirection);
		this.refreshCursor();
	},

	moveCursorToCurrentlyPlaying(){
		if (cursorOnIndex > this.musicIndex){
			while(cursorOnIndex != this.musicIndex)
				this.moveCursor(-1);
		}
		else if (cursorOnIndex < this.musicIndex){
			while(cursorOnIndex != this.musicIndex)
				this.moveCursor(1);
		}
		this.centerCursor();
	},

	refreshCursor(){
		if (cursorOnIndex === 0){
			this.moveCursorDown();
			this.moveCursorUp();
		}
		else{
			this.moveCursorUp();
			this.moveCursorDown();
		}
	},

	togglePlayPause(){
		event.preventDefault();		// For whitespace
		if (this.audio.paused)	this.audio.play();
		else this.audio.pause();
	},

	playCursorOnSong(){
		if (this.musicIndex === cursorOnIndex)
			return;
		this.musicIndex = cursorOnIndex;
		this.skipToNextTrack();
	},


	/***	Select	***/
	startSelectMode(){
		$(getCursorOnSongID()+" div:nth-child(2)").addClass("selectionBox");
		this.initialSelect = cursorOnIndex;
		this.lastSelect = cursorOnIndex;
	},
	addToSelect(){
		$(getCursorOnSongID()+" div:nth-child(2)").addClass("selectionBox");
		this.lastSelect = cursorOnIndex;
	},
	removePreviousFromSelect(previousIndex){
		$(this.songOrder[previousIndex]+" div:nth-child(2)").removeClass("selectionBox");
		this.lastSelect = cursorOnIndex;
	},
	getSelectStart(){
		return (this.initialSelect > this.lastSelect) ? this.lastSelect : this.initialSelect;
	},
	getSelectEnd(){
		return (this.initialSelect > this.lastSelect) ? this.initialSelect : this.lastSelect;
	},
	removeAllSelect(){
		for (var i = this.getSelectStart(); i < this.getSelectEnd()+1; i++)
			$(this.songOrder[i]+" div:nth-child(2)").removeClass("selectionBox");
	},
	/***	Select	***/


	afterCurrentlyPlaying(){
		return (this.musicIndex > cursorOnIndex);
	},

	wildcardInput(tempSongName, originally0){
		function matchRuleShort(str, rule) {
			return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
		}
		function nonCaseSensitiveFit(i){
			return (!caseSensitiveInput && matchRuleShort(musicApp.library[i].toLowerCase(), tempSongName));
		}
		function caseSensitiveFit(i){
			return (caseSensitiveInput && matchRuleShort(musicApp.library[i], tempSongName));
		}

		var caseSensitiveInput = !(tempSongName.toLowerCase() === tempSongName);
		var songAdditionCount = 0;
		for (var i = 0; i < this.library.length; i++){
			if ((nonCaseSensitiveFit(i) || caseSensitiveFit(i)) && this.isNotPlaylist(musicApp.library[i])){
				this.genNewLi(musicApp.library[i], cursorOnIndex+songAdditionCount);
				songAdditionCount++;
			}
		}
		if (this.afterCurrentlyPlaying() && !originally0){
			this.changeMusicIndex(songAdditionCount);
			this.lastPlayed+=songAdditionCount;
			originally0 = false;
		}
		else if (originally0){
			this.refreshCursor();
		}
	},

	outOfAppBehaviorDetermine(){
		// Key lag
		var numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
		if (event.key === "f" || event.key === "d"){
			if( musicApp.keyDownPressed === true )	return false;
			musicApp.keyDownPressed = true;
			setTimeout(function() { musicApp.keyDownPressed = false }, 200);
		}
		if (event.which === 70)		// f
			musicApp.nextSong();
		else if (event.which === 68)		// d
			musicApp.previousSong();
		else if (numberKeys.includes(event.key))						// 1~10
			musicApp.skipToSection(event.key);
		else if (event.which === 186 && !event.shiftKey)		// ;
			musicApp.audio.currentTime -= 3;		// Move back
		else if (event.which === 186 && event.shiftKey)			// :
			musicApp.audio.currentTime += 3;		// Move forward
		else if (event.which === 187 && event.shiftKey)			// +
			musicApp.changeVolume(1);
		else if (event.which === 189)												// -
			musicApp.changeVolume(-1);
		else if (event.which === 32)	// Space
			musicApp.togglePlayPause();
	},

	behaviorDetermine(){
		var numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

		if (musicApp.mode["enter"] || musicApp.mode["search"]){
			if (event.which === 27)					// Esc
				musicApp.setMode("normal");

			else if (event.which === 13){		// Enter
				if (musicApp.mode["enter"])
					musicApp.enterInput();
				else if (musicApp.mode["search"])
					musicApp.searchInput();
				musicApp.setMode("normal");
			}
		}

		else if (event.which === 40)		// Down arrow
			musicApp.moveCursorDown();
		else if (event.which === 38)		// Up Arrow
			musicApp.moveCursorUp();
		else if(event.which === 65 && musicApp.lastKey === 77)						// ma
			musicApp.moveCursorToCurrentlyPlaying();
		else if (event.which === 71 && event.shiftKey)					// G
			musicApp.moveCursorToLast();
		else if (event.which === 71 && musicApp.lastKey === 71)					// gg
			musicApp.moveCursorToFirst();
		else if (event.which === 90 && musicApp.lastKey === 90)					// zz
			musicApp.centerCursor();

		else if (musicApp.mode["select"]){
			if (event.which === 27)						// Esc
				musicApp.setMode("normal");

			else if (event.which === 76)			// l
				musicApp.setLoop("multi");

			else if (event.which === 68)			// d
				musicApp.deleteSelectedSongs();
			else if (event.which === 88 && event.ctrlKey)		// Ctrl-x
				musicApp.cutSelectedSongs();
			else if (event.which === 89)			// yy
				musicApp.copySelectedSongs();

			else{
				musicApp.lastKey = event.which;
				return;
			}
			musicApp.setMode("normal");
		}

		else if (event.which === 69)										// e
			musicApp.setMode("enter");
		else if (event.which === 191)										// Forward slash
			musicApp.setMode("search");
		else if (event.which === 86 && event.shiftKey)	// V
			musicApp.setMode("select");
		else if (event.which === 76)										// l
			musicApp.setLoop("single");

		else if (event.which === 86)											// v
			musicApp.toggleView();
		else if (event.key === "s")	// Space/s
			musicApp.togglePlayPause();

		else if (event.which === 65 && event.ctrlKey)			// Ctrl-a
			musicApp.selectAll();
		else if (event.which === 13)											// Enter
			musicApp.playCursorOnSong();
		else if (event.which === 8)												// Backspace
			musicApp.deleteCursorOnSong();
		else if (event.which === 116)												// F5
			musicApp.clearAll();
		else if (event.which === 88 && event.ctrlKey)			// Ctrl-x
			musicApp.cutCursorOnSong();
		else if (event.which === 89 && musicApp.lastKey === 89)		// yy
			musicApp.copyCursorOnSong();
		else if (event.which === 80)											// p
			musicApp.pasteFromClipboard();

		else if (event.key === "q") {		// Quit
			if (this.animation_size === 3)
				this.toggleView();
			inApp["music"] = false;
			stopApp("musicApp");
		}
		else
			musicApp.outOfAppBehaviorDetermine(); 

		musicApp.lastKey = event.which;
	}
}


