var state = "play";
var terrainVisibility,
	terrainVisibility1,
	terrainVisibility2;

function exit() {
	window.close();
}

function play() {
	if (state == "play") {
		document.getElementById('playSvg').src = 'assets/play.svg';
		document.getElementById('playDescription').innerHTML = 'Play';
		state = "pause";
	} else {
		document.getElementById('playSvg').src = 'assets/pause.svg';
		document.getElementById('playDescription').innerHTML = 'Pause';
		state = "play";
	}
	// ...
}

function restart() {
	location.reload(); // FOR TESTING.
	// ...
}
function los() {
	console.log(terrainVisibility);
	console.log(terrainVisibility1);
	console.log(terrainVisibility2);
	console.log(terrainVisibility == terrainVisibility1);
	console.log(terrainVisibility == terrainVisibility2);

	if (terrainVisibility == terrainVisibility1)
		terrainVisibility = terrainVisibility2;
	else terrainVisibility = terrainVisibility1;
	// ...
}