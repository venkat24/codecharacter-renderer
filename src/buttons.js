var state = "play";

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
	// ...
}