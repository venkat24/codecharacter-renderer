var fs = require('fs');
var path = require('path');
var num = fs.readFileSync(path.join(__dirname, 'ipc/codechar/level_number.txt'));

for (var i = 1; i <= num; i++) {
	var div = document.createElement("div");
	div.innerHTML = "<div class=\"menu-button\" id=\"level"+ i +"\" onclick=\"level='0"+ i +"'; loadChild();\"> <div class=\"button-text\">Level "+ i +"</div></div>";
	document.body.appendChild(div);
}

var rendererState = 1,
	gameState = "play",
	losState = 1,
	level = '01',
	fade = document.getElementById("fade");

function exit() {
	if (rendererState == 3 || rendererState == 4) {
		fade.style.zIndex = 100;
		fade.style.opacity = 1;
		document.getElementById('score').style.visibility = 'hidden';
		if (process.platform === 'win32') {
			child.stdout.end();
			spawn("taskkill", ["/pid", child.pid, '/f', '/t']);
		}
		else {
			child.kill();
		}
		ipcRenderer.send('pid-message', null);
		rendererState = 0;
		resetConsole();

		setTimeout(function() {
			rendererState = 1;
			endGame();
			started = false;

			visiblitityChange();
			menu.visible = true;
		}, 500);
	}
}

function play() {
	if (rendererState == 3) {
		if (gameState == "play") {
			document.getElementById('playSvg').src = 'assets/play.svg';
			document.getElementById('playDescription').innerHTML = 'Play';
			gameState = "pause";
			child.stdin.write("1"+level+"11\n");
		} else {
			document.getElementById('playSvg').src = 'assets/pause.svg';
			document.getElementById('playDescription').innerHTML = 'Pause';
			gameState = "play";
			child.stdin.write("2"+level+"11\n");
		}
	}
}

function restart() {
	if (rendererState == 3) {
		fade.style.zIndex = 100;
		fade.style.opacity = 1;
		resetConsole();
		if (process.platform === 'win32') {
			child.stdout.end();
			spawn("taskkill", ["/pid", child.pid, '/f', '/t']);
		}
		else {
			child.kill();
		}
		ipcRenderer.send('pid-message', null);

		setTimeout(function() {
			endGame();
			started = false;
			rendererState = 0;
			loadChild();
		}, 500);
	}
}

function los() {
	fade.style.zIndex = 100;
	fade.style.opacity = 1;
	setTimeout(function() {
		losState >= 2 ? losState = 0 : losState++;
		fade.style.zIndex = -10;
		fade.style.opacity = 0;
		document.getElementById('losImg').src = "assets/los"+losState+".png";
	}, 500);
}

function loadChild() {
	if (rendererState != 3) {
		var exec_name = path.join(__dirname, 'ipc/codechar/bin/main.exe');
		var level_location = path.join(__dirname, 'ipc/codechar/bin/level' + level + '_terrain');
		console.log(exec_name + "\n" + level_location);
		child = spawn(exec_name, ['r', level, level_location], {
			env: {
				'LD_LIBRARY_PATH': path.join(__dirname, 'ipc/codechar/lib')
			}
		});
		ipcRenderer.send('pid-message', child.pid);
		fade.style.zIndex = 100;
		fade.style.opacity = 1;

		child.stdout.setEncoding('ascii');

		child.stdout.on('data', (data) => {
			protobuf.load(path.join(__dirname, 'ipc/proto/state.proto'), function(err, root) {
				var curMessage = fs.readFileSync('1h');
				setArrays(curMessage, root.lookup("IPC.State"));
			});
		});
	}
}

function startGame() {
	if (rendererState != 3) {
		losState = 1;
		document.getElementById('losImg').src = 'assets/los1.png';
		document.getElementById('playSvg').src = 'assets/pause.svg';
		document.getElementById('playDescription').innerHTML = 'Pause';
		gameState = "play";
		child.stdin.write("2"+level+"12\n");

		setTimeout(function() {
			if (rendererState == 2)
				stage.removeChild(story);
			rendererState = 3;
			visiblitityChange();
			menu.visible = false;
			loadGame();
			setTimeout(fadeIn, 500);
		}, 500);
	}
}

function visiblitityChange() {
	if (rendererState == 1) {

		document.getElementById('end-screen').style.zIndex = -10;
		document.getElementById('end-screen').style.opacity = 0;
		document.getElementById('lclick').style.zIndex = -10;
		document.getElementById('lclick').style.opacity = 0;

		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'visible';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 2) {

		document.getElementById('score').style.visibility = 'hidden';
		document.getElementById('lclick').style.zIndex = 99;
		document.getElementById('lclick').style.opacity = 1;

		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'hidden';

	} else if (rendererState == 3) {

		document.getElementById('score').style.visibility = 'visible';
		document.getElementById('lclick').style.zIndex = -10;
		document.getElementById('lclick').style.opacity = 0;

		var menuButtons = document.getElementsByClassName('menu-button');
		for (var i = 0; i < menuButtons.length; i++)
			menuButtons[i].style.visibility = 'hidden';

		var gameButtons = document.getElementsByClassName('game-button');
		for (var i = 0; i < gameButtons.length; i++)
			gameButtons[i].style.visibility = 'visible';

	}
}

function resetConsole() {
	userConsole.style.opacity = 0;
	userConsole.style.width = "25%";
	setTimeout(function() {userConsole.style.zIndex = -75}, 200);
	consoleMessages.innerHTML = "";
}