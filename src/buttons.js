var state = "play";
	losState = 1;
var terrainVisibility,
	terrainVisibility0,
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
	losState >= 2 ? losState = 0 : losState++;
	document.getElementById('losImg').src = `assets/los${losState}.png`;
	terrainVisibility = eval(`terrainVisibility${losState}`);
}