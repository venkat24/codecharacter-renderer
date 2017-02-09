var protobuf = require('protobufjs');
var spawn = require('child_process').spawn;
var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var child;

var stateVariable,
	terrain,
	messages = [],
	started = false,
	actors = [],
	towers = [],
	flags = [],
	fireBalls = [],
	bases = [],
	visibilityArray = [getVisiblityAll(), getVisiblityAll(), getVisiblityAll()];

function setArrays(data, state) {
	stateVariable = state.decode(data);

	if (stateVariable.exitStatus) {
		child.on('close', (data) => {
			rendererState = 4;
			document.getElementById('result1').innerHTML = stateVariable.scorePlayer1.low;
			document.getElementById('result2').innerHTML = stateVariable.scorePlayer2.low;
			displayScore();
		});
		child.stdin.write('0\n');
	}

	var tempState = stateVariable.actors;
	if (tempState.length > stateVariable.noOfActors.low)
		tempState.splice(stateVariable.noOfActors.low, tempState.length - stateVariable.noOfActors.low);

	var actorCount = 0,
		towerCount = 0,
		flagCount = 0,
		baseCount = 0,
		fireBallCount = 0;

	if (tempState.length == stateVariable.noOfActors.low) {
		actors = [];
		towers = [];
		flags = [];
		fireBalls = [];
		bases = [];
	}
	for (var i = 0; i < fireBallSprites.length; i++) {
		stage.removeChild(fireBallSprites[i]);
	}

	for (var i = 0; i < tempState.length; i++) {
		if (tempState[i].actorType == 1) {
			fireBalls[fireBallCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) != 'object' || ['attackTargetPosition', 'destination'].indexOf(j) != -1) {
					fireBalls[fireBallCount][j] = tempState[i][j];
				}
				else fireBalls[fireBallCount][j] = tempState[i][j].low;
			}
			fireBalls[fireBallCount].center = {};
			fireBallCount++;
			loadFireBalls();
		}
		else if (tempState[i].actorType == 2) {
			bases[baseCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) != 'object' || ['attackTargetPosition', 'destination'].indexOf(j) != -1) {
					bases[baseCount][j] = tempState[i][j];
				}
				else bases[baseCount][j] = tempState[i][j].low;
			}
			baseCount++;
		}
		else if (tempState[i].actorType == 3) {
			flags[flagCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) != 'object' || ['attackTargetPosition', 'destination'].indexOf(j) != -1) {
					flags[flagCount][j] = tempState[i][j];
				}
				else flags[flagCount][j] = tempState[i][j].low;
			}
			flagCount++;
		}
		else if (tempState[i].actorType == 7) {
			towers[towerCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) != 'object' || ['attackTargetPosition', 'destination'].indexOf(j) != -1) {
					towers[towerCount][j] = tempState[i][j];
				}
				else towers[towerCount][j] = tempState[i][j].low;
			}
			towers[towerCount].center = {};
			towerCount++;
		}
		else {
			actors[actorCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) != 'object' || ['attackTargetPosition', 'destination'].indexOf(j) != -1) {
					actors[actorCount][j] = tempState[i][j];
				}
				else actors[actorCount][j] = tempState[i][j].low;
			}
			actors[actorCount].center = {};
			actorCount++;
		}
	}

	if (stateVariable.player1Los && stateVariable.player2Los) {
		terrainVisibility1 = [];
		terrainVisibility2 = [];
		for (var i = 0; i < stateVariable.player1Los.row.length; i++) {
			terrainVisibility1[i] = [];
			terrainVisibility2[i] = [];
			for (var j = 0; j < stateVariable.player1Los.row[i].element.length; j++) {
				terrainVisibility1[i][j] = stateVariable.player1Los.row[i].element[j];
				terrainVisibility2[i][j] = stateVariable.player2Los.row[i].element[j];
			}
		}
		visibilityArray[1] = terrainVisibility1;
		visibilityArray[2] = terrainVisibility2;
	}

	if (stateVariable.userLogs) {
		for (var i = 0; i < stateVariable.userLogs.length; i++) {
			messages.push(stateVariable.userLogs[i]);
		}
		stateVariable.userLogs = [];
	}

	if (!started) {
		terrain = getTerrain();
		startGame();
		started = true;
	}
}

var map,
	gridSize,
	actorSprites = [],
	actorTextures = [],
	towerSprites = [],
	flagSprites = [],
	fireBallSprites = [],
	baseSprites = [],
	actorHP = [],
	towerHP = [],
	grid = [],
	fog = [];


function loadGame() {
	loadTerrain();
	loadActors();
	loadTowers();
	loadFlags();
	loadFog();
	loadHP();
	loadBases();
}

function getTerrain() {
	var terrainArray = [];
	protobuf.load(path.join(__dirname, 'ipc/proto/terrain.proto'), function(err, root) {
		// var data = fs.readFileSync("./src/ipc/terrain files/terrain_level"+level);
		var data = fs.readFileSync(path.join(__dirname, 'ipc/terrain/terrain_level01'));
		var message = root.lookup("IPC.Terrain");
		var terrainTemp = message.decode(data);
		gridSize = terrainTemp.sizeOfElement.low;

		for (var i = 0; i < terrainTemp.noOfRows.low; i++) {
			terrainArray[i] = [];
			for (var j = 0; j < terrainTemp.noOfRows.low; j++) {
				terrainArray[i][j] = terrainTemp.row[i].element[j].type;
			}
		}
	});

	return terrainArray;
}

function getVisiblityAll() {
	var arr = [];
	for (var i = 0; i < 30; i++) {
		arr[i] = [];
		for (var j = 0; j < 30; j++) {
			arr[i][j] = 2;
		}
	}

	return arr;
}

function loadTerrain() {
	terrainVisibility = visibilityArray[1];

	for (var i = 0; i < terrain.length; i++) {
		grid[i] = [];
		for (var j = 0; j < terrain[i].length; j++) {
			if (terrain[i][j] === 0)
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.plain.texture);
			else if (terrain[i][j] === 1)
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.forest.texture);
			else if (terrain[i][j] === 2)
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.mountain.texture);

			grid[i][j].setTransform(gridSize * i, gridSize * j, gridSize/200, gridSize/200); // 256 is the image's size.
			stage.addChild(grid[i][j]);
		}
	}

	map = {
		width: gridSize * grid[0].length,
		height: gridSize * grid.length
	};
	zoom.init = map.width;
}

function loadFog() {
	for (var i = 0; i < terrain.length; i++) {
		fog[i] = [];
		for (var j = 0; j < terrain[i].length; j++) {
			fog[i][j] = new PIXI.Sprite(PIXI.loader.resources.fog.texture);
			fog[i][j].setTransform(gridSize * i, gridSize * j);
			stage.addChild(fog[i][j]);
		}
	}
}

function loadActors() {
	for (var i = 0; i < actors.length; i++) {
		actorTextures[i] = [];
		if (actors[i].actorType === 0) {
			if (actors[i].playerId === 0)
				var base = PIXI.loader.resources.wizard1.texture;
			else var base = PIXI.loader.resources.wizard2.texture;

			actorTextures[i][0] = [];
			actorTextures[i][1] = [];
			actorTextures[i][2] = [];
			actorTextures[i][3] = [];

			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base);
				frameTexture.frame = new PIXI.Rectangle(10, 10 + 200*j, 80, 80);
				actorTextures[i][0][j] = [frameTexture, frameTexture];
				actorTextures[i][1][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base);
				frameTexture.frame = new PIXI.Rectangle(100, 5 + 200*j, 100, 90);
				actorTextures[i][2][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][3][j] = [];
				for (var k = 0; k < 4; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(5 + 100*k, 100 + 200*j, 90, 100);
					actorTextures[i][3][j][k] = frameTexture;
				} //speed = 0.3
			}
			actorSprites[i] = new PIXI.extras.AnimatedSprite(actorTextures[i][0][0]);
			actorSprites[i].animationSpeed = 0.35;
			actorSprites[i].play();
			actorSprites[i].state = 's';
		}

		else if (actors[i].actorType == 6) {
			if (actors[i].playerId === 0)
				var base = PIXI.loader.resources.swordsman1.texture;
			else var base = PIXI.loader.resources.swordsman2.texture;

			actorTextures[i][0] = [];
			actorTextures[i][1] = [];
			actorTextures[i][2] = [];
			actorTextures[i][3] = [];

			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base);
				frameTexture.frame = new PIXI.Rectangle(5 + 100*j, 0, 90, 98);
				actorTextures[i][0][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][1][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(5 + 100*k, 100 + 300*j, 90, 98);
					actorTextures[i][1][j][k] = frameTexture;
				}
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][2][j] = [];
				for (var k = 0; k < 4; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(2 + 100*k, 200 + 300*j, 100, 98);
					actorTextures[i][2][j][k] = frameTexture;
				}
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][3][j] = [];
				for (var k = 0; k < 4; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(2 + 100*k, 300*(j+1), 100, 98);
					actorTextures[i][3][j][k] = frameTexture;
				} //speed = 0.3
			}
			actorSprites[i] = new PIXI.extras.AnimatedSprite(actorTextures[i][0][0]);
			actorSprites[i].animationSpeed = 0.10;
			actorSprites[i].play();
			actorSprites[i].state = 's';
		}
		else if (actors[i].actorType == 5) {
			if (actors[i].playerId === 0)
				var base = PIXI.loader.resources.scout1.texture;
			else var base = PIXI.loader.resources.scout2.texture;

			actorTextures[i][0] = [];
			actorTextures[i][1] = [];
			actorTextures[i][3] = [];

			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base);
				frameTexture.frame = new PIXI.Rectangle(5 + 150*j, 0, 140, 145);
				actorTextures[i][0][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][1][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(5 + 150*k, 150 + 450*j, 140, 140);
					actorTextures[i][1][j][k] = frameTexture;
				}
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][3][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base);
					frameTexture.frame = new PIXI.Rectangle(5 + 150*k, 450*(j+1), 140, 98);
					actorTextures[i][3][j][k] = frameTexture;
				} //speed = 0.3
			}
			actorSprites[i] = new PIXI.extras.AnimatedSprite(actorTextures[i][0][0]);
			actorSprites[i].animationSpeed = 0.10;
			actorSprites[i].play();
			actorSprites[i].state = 's';
		}
		else if (actors[i].actorType == 4) {
			if (actors[i].playerId === 0) {
				var base1 = PIXI.loader.resources.king1.texture;
				var base2 = PIXI.loader.resources.kingFlag1.texture;
			} else {
				var base1 = PIXI.loader.resources.king2.texture;
				var base2 = PIXI.loader.resources.king2.texture;
			}

			actorTextures[i][0] = [];
			actorTextures[i][1] = [];
			actorTextures[i][2] = [];
			actorTextures[i][3] = [];
			actorTextures[i][4] = [];
			actorTextures[i][5] = [];

			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base1);
				frameTexture.frame = new PIXI.Rectangle(94*j, 0, 90, 95);
				actorTextures[i][0][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				var frameTexture = new PIXI.Texture(base2);
				frameTexture.frame = new PIXI.Rectangle(94*j, 0, 85, 95);
				actorTextures[i][3][j] = [frameTexture, frameTexture];
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][1][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base1);
					frameTexture.frame = new PIXI.Rectangle(94*k, 85 + 197*j, 85, 95);
					actorTextures[i][1][j][k] = frameTexture;
				}
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][4][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base2);
					frameTexture.frame = new PIXI.Rectangle(94*k, 85 + 197*j, 85, 95);
					actorTextures[i][4][j][k] = frameTexture;
				}
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][2][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base1);
					frameTexture.frame = new PIXI.Rectangle(94*k, 197*(j+1), 85, 95);
					actorTextures[i][2][j][k] = frameTexture;
				} //speed = 0.3
			}
			for (var j = 0; j < 4; j++) {
				actorTextures[i][5][j] = [];
				for (var k = 0; k < 3; k++) {
					var frameTexture = new PIXI.Texture(base2);
					frameTexture.frame = new PIXI.Rectangle(94*k, 197*(j+1), 85, 95);
					actorTextures[i][5][j][k] = frameTexture;
				} //speed = 0.3
			}
			actorSprites[i] = new PIXI.extras.AnimatedSprite(actorTextures[i][0][0]);
			actorSprites[i].animationSpeed = 0.10;
			actorSprites[i].play();
			actorSprites[i].state = 's';
		}

		actorSprites[i].setTransform(actors[i].x, actors[i].y);
		stage.addChild(actorSprites[i]);
	}
}

function loadTowers() {
	for (var i = 0; i < towers.length; i++) {
		if (towers[i].playerId === 0)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower1.texture);
		else if (towers[i].playerId == 1)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower2.texture);

		towers[i].currentID = towers[i].playerId;
		towers[i].lastSeenID = towers[i].playerId;
		towerSprites[i].setTransform(towers[i].x, towers[i].y);
		stage.addChild(towerSprites[i]);
	}
}

function loadHP() {
	for (var i = 0; i < actors.length; i++) {
		actorHP[i] = [];
		var health = actors[i].hp/actors[i].maxHp;
		actorHP[i][0] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		actorHP[i][0].setTransform(actors[i].x - 5, actors[i].y - 12, health, 1);
		actorHP[i][1] = new PIXI.Sprite(PIXI.loader.resources.border.texture);
		actorHP[i][1].setTransform(actors[i].x - 6, actors[i].y - 13);
		stage.addChild(actorHP[i][0]);
		stage.addChild(actorHP[i][1]);
	}
	for (var i = 0; i < towers.length; i++) {
		towerHP[i] = [];
		var health = towers[i].hp/towers[i].maxHp;
		towerHP[i][0] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		towerHP[i][0].setTransform(towers[i].x - 5, towers[i].y - 12, health, 1);

		towerHP[i][1] = new PIXI.Sprite(PIXI.loader.resources.captureP1.texture);
		towerHP[i][1].setTransform(towers[i].x - 5, towers[i].y - 27, health/2, 1);

		towerHP[i][2] = new PIXI.Sprite(PIXI.loader.resources.captureP2.texture);
		towerHP[i][2].setTransform(towers[i].x + 38, towers[i].y - 27, health/2, 1);

		towerHP[i][3] = new PIXI.Graphics();
		towerHP[i][3].beginFill(0xFFFFFF);
		towerHP[i][3].lineStyle(1, 0x000000);
		towerHP[i][3].drawCircle(0, 0, 5);
		towerHP[i][3].setTransform(towers[i].x + 38, towers[i].y - 8);

		towerHP[i][4] = new PIXI.Sprite(PIXI.loader.resources.border.texture);
		towerHP[i][4].setTransform(towers[i].x - 6, towers[i].y - 13);

		for (var j = 0; j < 5; j++) {
			stage.addChild(towerHP[i][j]);
		}
	}
}

function loadFlags() {
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].playerId === 0)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag1.texture);
		if (flags[i].playerId == 1)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag2.texture);

		flagSprites[i].setTransform(flags[i].x, flags[i].y);
		stage.addChild(flagSprites[i]);
	}
}

function loadFireBalls() {
	for (var i = 0; i < fireBallSprites.length; i++) {
		stage.removeChild(fireBallSprites[i]);
	}

	for (var i = 0; i < fireBalls.length; i++) {
		if (fireBalls[i].playerId === 0)
			fireBallSprites[i] = new PIXI.Sprite(PIXI.loader.resources.fireBall1.texture);
		else fireBallSprites[i] = new PIXI.Sprite(PIXI.loader.resources.fireBall2.texture);

		fireBallSprites[i].setTransform(fireBalls[i].x, fireBalls[i].y, 1, 1, fireBalls[i].rotation);
		stage.addChild(fireBallSprites[i]);
	}
}

function loadBases() {
	for (var i = 0; i < bases.length; i++) {
		baseSprites[i] = new PIXI.Sprite(PIXI.loader.resources.base.texture);

		baseSprites[i].setTransform(bases[i].x - 102, bases[i].y - 102);
		stage.addChild(baseSprites[i]);
	}
}

function fadeIn() {
	fade.style.zIndex = -10;
	fade.style.opacity = 0;

	// TO BE CHANGED AFTER INTEGRATION
	camera.x = 0;
	camera.y = 0;
	camera.zoom = 0.6;
	zoom.val = 0.6;
}

function displayScore() {
	document.getElementById('end-screen').style.zIndex = 80;
	document.getElementById('end-screen').style.opacity = 1;
	document.getElementById('lclick').style.zIndex = 90;
	document.getElementById('lclick').style.opacity = 1;
	document.getElementById('score').style.visibility = 'hidden';

	if (stateVariable.scorePlayer1.low > stateVariable.scorePlayer2.low) {
		document.getElementById('outcome').innerHTML = "WINNER: PLAYER 1";
		document.getElementById('outcome').style.color = "red";
	} else if (stateVariable.scorePlayer1.low < stateVariable.scorePlayer2.low) {
		document.getElementById('outcome').innerHTML = "WINNER: PLAYER 2";
		document.getElementById('outcome').style.color = "blue";
	} else {
		document.getElementById('outcome').innerHTML = "DRAW";
		document.getElementById('outcome').style.color = "white";
	}

	while (stage.children.length > 1) {
		n = stage.getChildAt(1);
		stage.removeChild(n);
	}
}

function endGame() {
	while (stage.children.length > 1) {
		n = stage.getChildAt(1);
		stage.removeChild(n);
	}
	document.getElementById('score1').innerHTML = '0';
	document.getElementById('score2').innerHTML = '0';
	document.getElementById('result1').innerHTML = '0';
	document.getElementById('result2').innerHTML = '0';
	setTimeout(fadeIn, 500);
}