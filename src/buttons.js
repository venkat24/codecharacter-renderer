var rendererState = 1,
	gameState = "play",
	losState = 1;
	fade = document.getElementById("fade");

function exit() {
	if (rendererState == 3) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;

		setTimeout(function() {
			rendererState = 1;
			endGame();
			visiblitityChange();
			menu.visible = true;
		}, 500);
	}

	protobuf.load("./src/test/interrupts.proto", function(err, root) {
	    if (err) throw err;

	    var Interrupts = root.lookup("IPC.Interrupts");
	    var message = Interrupts.create({ exitStatus: {value: false} });
	    var buffer = Interrupts.encode(message).finish();

		child.stdin.write(buffer);
		child.stdin.end();
	});
}

function play() {
	if (gameState == "play") {
		document.getElementById('playSvg').src = 'assets/play.svg';
		document.getElementById('playDescription').innerHTML = 'Play';
		gameState = "pause";
	} else {
		document.getElementById('playSvg').src = 'assets/pause.svg';
		document.getElementById('playDescription').innerHTML = 'Pause';
		gameState = "play";
	}

	protobuf.load("./src/test/interrupts.proto", function(err, root) {
	    if (err) throw err;

	    var Interrupts = root.lookup("IPC.Interrupts");
	    var message = Interrupts.create({ playStatus: {value: false} });
	    var buffer = Interrupts.encode(message).finish();

		child.stdin.write(buffer);
		child.stdin.end();
	});
}

function restart() {
	if (rendererState == 3) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;

		setTimeout(function() {
			losState = 1;
			document.getElementById('losImg').src = `assets/los1.png`;

			endGame();
			loadGame();
		}, 500);
	}

	protobuf.load("./src/test/interrupts.proto", function(err, root) {
	    if (err) throw err;

	    var Interrupts = root.lookup("IPC.Interrupts");
	    var message = Interrupts.create({ restartStatus: {value: true} });
	    var buffer = Interrupts.encode(message).finish();

		child.stdin.write(buffer);
		child.stdin.end();
	});
}

function los() {
	losState >= 2 ? losState = 0 : losState++;
	fade.style.zIndex = 10;
	fade.style.opacity = 1;
	setTimeout(function() {
		fade.style.zIndex = -10;
		fade.style.opacity = 0;
		document.getElementById('losImg').src = `assets/los${losState}.png`;
		terrainVisibility = visibilityArray[losState];
	}, 500);
}

function startStory() {
	if (rendererState == 1) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;

		setTimeout(function() {
			rendererState = 2;
			visiblitityChange();
			menu.visible = false;
			loadStory();
		}, 500);
	}
}

function startGame() {
	if (rendererState != 3) {
		fade.style.zIndex = 10;
		fade.style.opacity = 1;
		losState = 1;
		document.getElementById('losImg').src = `assets/los1.png`;

		setTimeout(function() {
			if (rendererState == 2)
				stage.removeChild(story);
			rendererState = 3;
			visiblitityChange();
			menu.visible = false;
			loadGame();
		}, 500);
	}

	protobuf.load("./src/test/interrupts.proto", function(err, root) {
	    if (err) throw err;

	    var Interrupts = root.lookup("IPC.Interrupts");
	    var message = Interrupts.create({ levelNumber: 45 });
	    var buffer = Interrupts.encode(message).finish();

		child.stdin.write(buffer);
		child.stdin.end();
	});
}

function visiblitityChange() {
	if (rendererState == 1) {
		document.getElementById('slide-in').style.visibility = 'visible';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'visible';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 2) {

		document.getElementById('slide-in').style.visibility = 'hidden';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 3) {

		document.getElementById('slide-in').style.visibility = 'hidden';
		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'visible';

	}
}