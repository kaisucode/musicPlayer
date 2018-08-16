
var canvas = document.getElementById("rov_canvas");
var ctx = canvas.getContext('2d');

var animation_size = 1;
var stars = [], stars2 = [];	// Array that contains the stars
var FPS = 60;									// Frames per second
var numOfStars = 40;					// Number of stars

var nowPlaying = []
var library = []

var songOrder = [];
var setVolume = 1.0;
var lastPlayed = 0;
var musicIndex = 0;
var cursorOnIndex = musicIndex;
var audio = new Audio('data/mp3/'+nowPlaying[musicIndex]);

var mode = {
	"normal": true, 
	"enter": false,
	"search": false,
	"select": false
};
var lastMode;
var lastKey;
var keyDownPressed = false;
var immediatelyAfterSelectAll = false;




ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
canvas.width = 365*animation_size;
canvas.height = 280*animation_size;

function createStars(){
	for (var i = 0; i < numOfStars; i++) {
		stars.push({
			x: (i*8+10)*animation_size,
			y: 350,
			radius: Math.random() * 1 + 2,
		});
		stars2.push({
			x: (i*8+10)*animation_size,
			y: 350,
		});
	}
}

function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.globalCompositeOperation = "lighter";

	for (var i = 1, x = stars.length-1; i < x; i+=5) {
		var s = stars[i];
		ctx.beginPath();
		ctx.fillStyle = "#00FFF2";
		ctx.lineWidth = 0.08;
		ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();

		ctx.shadowColor = '#7DF9FF';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.stroke();
		ctx.fill();
	}

	ctx.beginPath();
	for (var i = stars.length-1; i > 0; i--){
		ctx.moveTo(stars[i].x, stars[i].y);
		ctx.lineTo(stars[i-1].x, stars[i-1].y);
		ctx.lineWidth = 2;
		ctx.lineWidth = 3;
		ctx.strokeStyle = '#3ECAE8';

		ctx.shadowColor = '#fff';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	}
	ctx.stroke();

	ctx.beginPath();
	for (var i = stars.length-1; i > 0; i--){
		ctx.moveTo(stars2[i].x, stars2[i].y);
		ctx.lineTo(stars2[i-1].x, stars2[i-1].y);
		ctx.lineWidth = 0.5;
		ctx.lineWidth = 0.8;
		ctx.strokeStyle = 'rgb(97.3%, 82.4%, 82.4%)';

		ctx.shadowColor = '#6e529b';
		ctx.shadowBlur = 10;
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
	}
	ctx.stroke();
}


function updateStarLocations(dataArray){
	for (var i = 0, x = stars.length; i < x; i++) {
		var s = stars[i];
		s.y = (-((dataArray[i*4]-180) * 40) / FPS + 110)*animation_size;		// 50~470
		if (s.y < 38) s.y = 38;

		var s2 = stars2[i];
		s2.y = (-((dataArray[(i+1)*3]-320) * 24) / FPS+65)*animation_size;
		if (s2.y < 38) s2.y = 38;
	}
}

function loadLibrary(){
	$.getJSON( "data/library.json", function( data ) {
		$.each( data, function( key, val ) {
			if (isNotPlaylist(val))
				library.push(val.slice(0, -4));
			else
				library.push(val);
		});
	});
}

function isNotPlaylist(filename){
	return (filename.slice(-5) != ".json");
}

function init(){
	audio = new Audio('data/mp3/'+nowPlaying[musicIndex]+".mp3");
	audio.addEventListener('ended', function(){
		changeMusicIndex(0);
		if (musicIndex === nowPlaying.length)
			musicIndex = 0;
		loadNextTrack();
		return;
	})

	audio.play();
	$("#rov_currentSongText").text(nowPlaying[musicIndex]);
	$("#rov_currentSongText").css("animation-duration", (nowPlaying[musicIndex].length+5)+"s");
	$(songOrder[lastPlayed]+" div:nth-child(1)").css("display", "none");
	$(songOrder[lastPlayed]+" div:nth-child(2)").css("margin-left", "+=30");
	lastPlayed = musicIndex;
	$(songOrder[musicIndex]+" div:nth-child(1)").css("display", "inline-block");
	$(songOrder[musicIndex]+" div:nth-child(2)").css("margin-left", "0");
	audio.volume = setVolume;
	changeMusicIndex(1);

	try {
		audioCtx = new AudioContext();
		analyser = audioCtx.createAnalyser();
	} catch (e) {}
	source = audioCtx.createMediaElementSource(audio);
	source.connect(analyser);
	analyser.connect(audioCtx.destination);
	analyser.fftSize = 4096;
	frequencyData = new Uint8Array(analyser.frequencyBinCount);
};

function renderFrame(){
	analyser.getByteFrequencyData(frequencyData);		// 0~255
	draw();
	updateStarLocations(frequencyData);

	requestAnimationFrame(renderFrame);
};

function loadNextTrack(){
	init();
	renderFrame();
}

function setMode(newMode){
	for (var key in mode)
		mode[key] = false;
	mode[newMode] = true;

	lastKey = -1;
	if (mode["normal"]){
		$("#unfocus").focus(); 
		setAutocomplete(library);
		removeAllSelect();
	}
	else if (mode["enter"]){
		event.preventDefault();
		$("#songInput").focus();
		setAutocomplete(library);
	}
	else if (mode["search"]){
		event.preventDefault();
		$("#songInput").focus();
		setAutocomplete(nowPlaying);
	}
	else if (mode["select"]){
		$("#unfocus").focus(); 
		setAutocomplete(library);
		startSelectMode();
	}

	$("#rov_lightline").removeClass(lastMode+"Mode");
	$("#rov_lightline").addClass(newMode+"Mode");
	$(".rov_info").text(newMode.toUpperCase());
	lastMode = newMode;
}

window.onload = function (){
	var audioStream, analyser, source, audioCtx, canvasCtx, frequencyData, running = false;
	var numberKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

	createStars();
	loadLibrary();
	setMode("normal");
	setAutocomplete(library);

	// var filename = "LiSA Catch the moment";
	// var tempSongName = $("#songInput").val(filename);
	// enterInput();

	document.addEventListener("keydown", function onEvent(event) {

		// Key lag
		if (event.key === "f" || event.key === "d"){
			if( keyDownPressed === true )	return false;
			keyDownPressed = true;
			setTimeout(function() { keyDownPressed = false }, 200);
		}

		if (mode["enter"] || mode["search"]){
			if (event.which === 27)					// Esc
				setMode("normal");

			else if (event.which === 13){		// Enter
				if (mode["enter"])
					enterInput();
				else if (mode["search"])
					searchInput();
				setMode("normal");
			}
		}

		else if (event.which === 40)		// Down arrow
			moveCursorDown();
		else if (event.which === 38)		// Up Arrow
			moveCursorUp();
		else if(event.which === 65 && lastKey === 77)						// ma
			moveCursorToCurrentlyPlaying();
		else if (event.which === 71 && event.shiftKey)					// G
			moveCursorToLast();
		else if (event.which === 71 && lastKey === 71)					// gg
			moveCursorToFirst();
		else if (event.which === 90 && lastKey === 90)					// zz
			centerCursor();

		else if (mode["select"]){
			if (event.which === 27)						// Esc
				setMode("normal");

			else if (event.which === 76)			// l
				setLoop("multi");

			else if (event.which === 68)			// d
				deleteSelectedSongs();
			else if (event.which === 88 && event.ctrlKey)		// Ctrl-x
				cutSelectedSongs();
			else if (event.which === 89)			// yy
				copySelectedSongs();

			else{
				lastKey = event.which;
				return;
			}
			setMode("normal");
		}

		else if (event.which === 69)										// e
			setMode("enter");
		else if (event.which === 191)										// Forward slash
			setMode("search");
		else if (event.which === 86 && event.shiftKey)	// V
			setMode("select");
		else if (event.which === 76)										// l
			setLoop("single");

		else if (event.which === 86)											// v
			toggleView();
		else if (event.which === 32 || event.key === "s")	// Space/s
			togglePlayPause();

		else if (event.which === 70)		// f
			nextSong();
		else if (event.which === 68)		// d
			previousSong();

		else if (event.which === 65 && event.ctrlKey)			// Ctrl-a
			selectAll();
		else if (event.which === 13)											// Enter
			playCursorOnSong();
		else if (event.which === 8)												// Backspace
			deleteCursorOnSong();
		else if (event.which === 88 && event.ctrlKey)			// Ctrl-x
			cutCursorOnSong();
		else if (event.which === 89 && lastKey === 89)		// yy
			copyCursorOnSong();
		else if (event.which === 80)											// p
			pasteFromClipboard();

		else if (numberKeys.includes(event.key))						// 1~10
			skipToSection(event.key);
		else if (event.which === 186 && !event.shiftKey)		// ;
			audio.currentTime -= 3;		// Move back
		else if (event.which === 186 && event.shiftKey)			// :
			audio.currentTime += 3;		// Move forward

		else if (event.which === 187 && event.shiftKey)			// +
			changeVolume(1);
		else if (event.which === 189)												// -
			changeVolume(-1);

		lastKey = event.which;
	});
};


function setAutocomplete(datalist){
	$( "#songInput" ).autocomplete({
		source: datalist
	});
}

function selectAll(){
	event.preventDefault();
	moveCursorToFirst();
	setMode("select");
	moveCursorToLast();
	lastSelect = nowPlaying.length;
	immediatelyAfterSelectAll = true;
}

function getHeight(temp_id){
	return ($(temp_id).offset().top - $(window).scrollTop());
}

function getCursorOnSongID(){
	return songOrder[cursorOnIndex];
}

function moveCursor(sign){
	if (typeof moveCursor.cursorLastOn == 'undefined')
		moveCursor.cursorLastOn = "#song0";
	cursorOnIndex += sign;
	if (cursorOnIndex < 0)
		cursorOnIndex = 0;
	else if (cursorOnIndex > nowPlaying.length-1)
		cursorOnIndex = nowPlaying.length-1;
	$(moveCursor.cursorLastOn).removeClass("focusedBox");
	$(getCursorOnSongID()).addClass("focusedBox");
	moveCursor.cursorLastOn = getCursorOnSongID();
}

function changeVolume(sign){
	if (sign === 1 && audio.volume >= 0.9)
		audio.volume = 1.0;
	else if (sign === -1 && audio.volume <= 0.1)
		audio.volume = 0.0;
	else if (sign === 1 && audio.volume < 1)
		audio.volume = setVolume+0.1;
	else if (sign === -1 && audio.volume > 0)
		audio.volume = setVolume-0.1;
	setVolume = audio.volume;
}

function genNewLi(songName, index){
	if (typeof genNewLi.count == 'undefined')
		genNewLi.count = 0;
	var ul = document.getElementById("rov_nextUpList");
	var li = document.createElement("li");
	var arrowdiv = document.createElement("div");
	arrowdiv.appendChild(document.createTextNode("> "));
	arrowdiv.setAttribute("class", "arrow");
	li.appendChild(arrowdiv);
	var div = document.createElement("div");
	div.appendChild(document.createTextNode(songName));
	li.appendChild(div);
	li.setAttribute("id", "song"+genNewLi.count);
	li.setAttribute("tabindex", "-1");
	if (index === -1){
		ul.appendChild(li);
		songOrder.push("#song"+genNewLi.count);
	}
	else{
		index++;
		ul.insertBefore(li, ul.children[index]);
		songOrder.splice(index, 0, "#song"+genNewLi.count);
		nowPlaying.splice(index, 0, songName);
	}
	genNewLi.count++;
}

function shiftPage(sign){
	try {
		if (sign === 1 && getHeight(getCursorOnSongID()) > getHeight(".rov_scrollBox")+$(".rov_scrollBox").height())
			$(getCursorOnSongID())[0].scrollIntoView(false);
		else if (sign === -1 && getHeight(getCursorOnSongID()) < getHeight(".rov_scrollBox"))
			$(getCursorOnSongID())[0].scrollIntoView(true);
		else
			return;
	} 
	catch (e) {return;}
}

function moveCursorDown(){
	if (immediatelyAfterSelectAll){
		initialSelect = nowPlaying.length-1;
		lastSelect = 0;
		immediatelyAfterSelectAll = false;
		moveCursorToFirst();
	}
	moveCursor(1);
	shiftPage(1);

	if (mode["select"] && cursorOnIndex-1 != initialSelect && lastSelect <= initialSelect)
		removePreviousFromSelect(cursorOnIndex-1);
	else if (mode["select"])
		addToSelect();
}
function moveCursorUp(){
	if (immediatelyAfterSelectAll)
		immediatelyAfterSelectAll = false;
	moveCursor(-1);
	shiftPage(-1);

	if (mode["select"] && cursorOnIndex+1 != initialSelect && lastSelect >= initialSelect)
		removePreviousFromSelect(cursorOnIndex+1);
	else if (mode["select"])
		addToSelect();
}
function centerCursor(){
	if (cursorOnIndex < nowPlaying.length-4)
		$(songOrder[cursorOnIndex+3])[0].scrollIntoView(false);
}

function deleteCursorOnSong(){
	if (nowPlaying.length === 1){
		audio.pause();
		cursorOnIndex = 0;
		musicIndex = 0;
		$("#rov_currentSongText").text("Rainbow of Velaris");
	}
	$(getCursorOnSongID()).remove();

	if (cursorOnIndex === nowPlaying.length-1)
		nowPlaying.splice(nowPlaying.length-1, 1);
	else
		nowPlaying.splice(cursorOnIndex, 1);
	songOrder.splice(cursorOnIndex, 1);

	refreshCursor();
	if (musicIndex < cursorOnIndex+1){					// Currently playing on before deleted
	}
	else if (afterCurrentlyPlaying()){			// Currently playing on after deleted
		changeMusicIndex(-1);
		lastPlayed = musicIndex-1;
	}
	else if (musicIndex === cursorOnIndex+1){		// Currently playing was on deleted
		changeMusicIndex(-1);
		skipToNextTrack();
	}
}

var clipboard = [];
function pasteFromClipboard(){
	for (var i = 0; i < clipboard.length; i++)
		genNewLi(clipboard[i], cursorOnIndex+i);
	if (clipboard.length === 1 && cursorOnIndex+1 < musicIndex){
		musicIndex++;
		lastPlayed = cursorOnIndex+2;
	}
}

function copyCursorOnSong(){
	clipboard = [];
	clipboard.push($(getCursorOnSongID()).text().slice(2));
}
function cutCursorOnSong(){
	copyCursorOnSong();
	deleteCursorOnSong();
}

function copySelectedSongs(){
	clipboard = [];
	for (var i = -1; i < (getSelectEnd()-getSelectStart()); i++)
		clipboard.push($(songOrder[cursorOnIndex+i]).text().slice(2));
}

function deleteSelectedSongs(){
	var numOfSongsSelected = Math.abs(initialSelect-lastSelect)+1;
	moveCursorToSelectStart();
	removeAllSelect();
	for (var i = 0; i < numOfSongsSelected; i++)
		deleteCursorOnSong();
}

function cutSelectedSongs(){
	copySelectedSongs();
	deleteSelectedSongs();
}

function enterInput(){
	var tempSongName = $("#songInput").val();
	var autoplay = (nowPlaying.length === 0);
	var originally0 = nowPlaying.length === 0;

	if (tempSongName.indexOf("*") != -1)
		wildcardInput(tempSongName, originally0);
	else if (nameInLibrary(tempSongName)){
		if (tempSongName.slice(-5) === ".json"){		// Playlists
			var i = 0;
			$.getJSON( "data/playlists/"+tempSongName, function( data ) {
				$.each( data, function( key, val ) {
					if (val!=""){
						genNewLi(val.slice(0, -4), cursorOnIndex+i);
						i++;
					}
				});
				if (afterCurrentlyPlaying() && !originally0){
					changeMusicIndex(i);
					originally0 = false;
				}
				else if (originally0){
					refreshCursor();
				}
			});
		}
		else{	// Songs
			genNewLi(tempSongName, cursorOnIndex);
			refreshCursor();
		}
	}
	if (autoplay)
		setTimeout(function() {loadNextTrack();}, 100);
	$("#songInput").val("");
	$("#unfocus").focus();
}

function searchInput(){
	var tempSongName = $("#songInput").val();
	var index = $.inArray(tempSongName, nowPlaying);
	if (index != -1){
		while(cursorOnIndex != index)
			moveCursor(cursorOnIndex > index ? -1 : 1);
		refreshCursor();
		centerCursor();
	$("#songInput").val("");
	$("#unfocus").focus();
	}
}

function nameInLibrary(songName){
	return $.inArray(songName, library) != -1;	
}

function skipToSection(numWord){
	var num = parseInt(numWord);
	if (num === 0)
		num = 10;
	audio.currentTime = audio.duration*(num-1)/10;
}

function nextSong(){
	if (loopStyle["single"]){
		$(songOrder[lowerLoopLimit]+" div:nth-child(2)").removeClass("loopedBox");
		lowerLoopLimit++;
		upperLoopLimit++;
		$(songOrder[lowerLoopLimit]+" div:nth-child(2)").addClass("loopedBox");

		changeMusicIndex(0);
		skipToNextTrack();
	}
	else{
		changeMusicIndex(0);
		skipToNextTrack();
	}
}

function previousSong(){
		$(songOrder[lowerLoopLimit]+" div:nth-child(2)").removeClass("loopedBox");
		lowerLoopLimit--;
		upperLoopLimit--;
		$(songOrder[lowerLoopLimit]+" div:nth-child(2)").addClass("loopedBox");

	changeMusicIndex(-2);
	skipToNextTrack();
}

function skipToNextTrack(){
	audio.pause();
	loadNextTrack();
}

var lowerLoopLimit = 0;
var upperLoopLimit = nowPlaying.length;

function updateLoopLimits(newStyle){
	if (loopStyle["default"]){
		if (lowerLoopLimit === upperLoopLimit)
			$(songOrder[lowerLoopLimit+1]+" div:nth-child(2)").removeClass("loopedBox");
		else{
			for (var i = lowerLoopLimit; i < upperLoopLimit+1; i++)
				$(songOrder[i]+" div:nth-child(2)").removeClass("loopedBox");
		}
	}
	var loopLimits = {
		"default": [0, nowPlaying.length], 
		"single": [cursorOnIndex-1, cursorOnIndex-1],
		"multi": [getSelectStart(), getSelectEnd()+1]
	};
	lowerLoopLimit = loopLimits[newStyle][0];
	upperLoopLimit = loopLimits[newStyle][1];

	if (loopStyle["single"]){
		$(songOrder[lowerLoopLimit+1]+" div:nth-child(2)").addClass("loopedBox");
	}
	else if (loopStyle["multi"]){
		for (var i = lowerLoopLimit; i < upperLoopLimit; i++)
			$(songOrder[i]+" div:nth-child(2)").addClass("loopedBox");
	}
}

var loopStyle = {
	"default": true, 
	"single": false,
	"multi": false
};
function setLoop(newStyle){
	if (!loopStyle["default"])
		newStyle = "default";

	for (var key in loopStyle)
		loopStyle[key] = false;
	loopStyle[newStyle] = true;

	updateLoopLimits(newStyle);
	musicIndex++;
}

function changeMusicIndex(amount){
	musicIndex+=amount;
	if (!loopStyle["default"]){
		if(musicIndex < lowerLoopLimit || musicIndex >= upperLoopLimit)
			musicIndex = lowerLoopLimit;
	}
	else if (loopStyle["default"]){
		if(musicIndex < 0 || musicIndex === nowPlaying.length)
			musicIndex = 0;
	}
}

function moveCursorToLast(){
	if (mode["select"]){
		removeAllSelect();
		for (var i = initialSelect; i < nowPlaying.length; i++)
			$(songOrder[i]+" div:nth-child(2)").addClass("selectionBox");
		lastSelect = nowPlaying.length-1;
	}
	while(cursorOnIndex < nowPlaying.length-1)
		moveCursor(1);
	refreshCursor();
}

function moveCursorToFirst(){
	if (mode["select"]){
		removeAllSelect();
		for (var i = 0; i < initialSelect+1; i++)
			$(songOrder[i]+" div:nth-child(2)").addClass("selectionBox");
		lastSelect = 0;
	}
	while(cursorOnIndex > 0)
		moveCursor(-1);
	refreshCursor()
}

function moveCursorToSelectStart(){
	var target = getSelectStart();
	var moveDirection = (cursorOnIndex > target) ? -1 : 1;
	while(cursorOnIndex != target)
		moveCursor(moveDirection);
	refreshCursor();
}

function moveCursorToCurrentlyPlaying(){
	if (cursorOnIndex > musicIndex){
		while(cursorOnIndex != musicIndex)
			moveCursor(-1);
		moveCursorUp();
	}
	else if (cursorOnIndex < musicIndex){
		while(cursorOnIndex != musicIndex-1)
			moveCursor(1);
		refreshCursor();
	}
	centerCursor();
}

function refreshCursor(){
	if (cursorOnIndex === 0){
		moveCursorDown();
		moveCursorUp();
	}
	else{
		moveCursorUp();
		moveCursorDown();
	}
}

function toggleView(){
	if (animation_size === 1){
		animation_size = 3;
		$(".rov_equalizer_container").css("right", "17vh");
	}
	else if (animation_size === 3){
		animation_size = 1;
		$(".rov_equalizer_container").css("right", "0vh");
	}

	canvas.width = 365*animation_size;
	canvas.height = 280*animation_size;
	for (var i = 0, x = stars.length; i < x; i++) {
		stars[i].x = (i*8+10)*animation_size;
		stars2[i].x = (i*8+10)*animation_size;
	}
}

function togglePlayPause(){
	event.preventDefault();		// For whitespace
	if (audio.paused)	audio.play();
	else audio.pause();
}

function playCursorOnSong(){
	if (musicIndex === cursorOnIndex+1)
		return;
	musicIndex = cursorOnIndex;
	skipToNextTrack();
}

var initialSelect, lastSelect;
function startSelectMode(){
	$(getCursorOnSongID()+" div:nth-child(2)").addClass("selectionBox");
	initialSelect = cursorOnIndex;
	lastSelect = cursorOnIndex;
}

function addToSelect(){
	$(getCursorOnSongID()+" div:nth-child(2)").addClass("selectionBox");
	lastSelect = cursorOnIndex;
}

function removePreviousFromSelect(previousIndex){
	$(songOrder[previousIndex]+" div:nth-child(2)").removeClass("selectionBox");
	lastSelect = cursorOnIndex;
}

function getSelectStart(){
	return (initialSelect > lastSelect) ? lastSelect : initialSelect;
}
function getSelectEnd(){
	return (initialSelect > lastSelect) ? initialSelect : lastSelect;
}

function removeAllSelect(){
	for (var i = getSelectStart(); i < getSelectEnd()+1; i++)
		$(songOrder[i]+" div:nth-child(2)").removeClass("selectionBox");
	initialSelect = 0;
	lastSelect = 0;
}

function afterCurrentlyPlaying(){
	return (musicIndex > cursorOnIndex+1);
}

function wildcardInput(tempSongName, originally0){
	function matchRuleShort(str, rule) {
		return new RegExp("^" + rule.split("*").join(".*") + "$").test(str);
	}
	function nonCaseSensitiveFit(i){
		return (!caseSensitiveInput && matchRuleShort(library[i].toLowerCase(), tempSongName));
	}
	function caseSensitiveFit(i){
		return (caseSensitiveInput && matchRuleShort(library[i], tempSongName));
	}

	var caseSensitiveInput = !(tempSongName.toLowerCase() === tempSongName);
	var songAdditionCount = 0;
	for (var i = 0; i < library.length; i++){
		if ((nonCaseSensitiveFit(i) || caseSensitiveFit(i)) && isNotPlaylist(library[i])){
			genNewLi(library[i], cursorOnIndex+songAdditionCount);
			songAdditionCount++;
		}
	}
	if (afterCurrentlyPlaying() && !originally0){
		changeMusicIndex(songAdditionCount);
		lastPlayed+=songAdditionCount;
		originally0 = false;
	}
	else if (originally0){
		refreshCursor();
	}
}

