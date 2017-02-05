var protobuf = require('protobufjs');
var spawn = require('child_process').spawn;
var ipcRenderer = require('electron').ipcRenderer;
var fs = require('fs');
var child;

var stateVariable,
	started = false,
	actors = [],
	towers = [],
	flags = [],
	fireBalls = [],
	bases = [];

var terrain = getTerrain(),
	visibilityArray = [getVisiblityAll()];

function setArrays(data, state) {
	stateVariable = state.decode(data);
	var tempState = stateVariable.actors;
	if (tempState.length > stateVariable.noOfActors.low)
		tempState.splice(stateVariable.noOfActors.low, tempState.length - stateVariable.noOfActors.low);

	var actorCount = 0,
		towerCount = 0,
		flagCount = 0,
		baseCount = 0,
		fireBallCount = 0;

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

	if (!started) {
		startGame();
		started = true;
	}
}

var map,
	actorSprites = [],
	towerSprites = [],
	flagSprites = [],
	fireBallSprites = [],
	baseSprites = [],
	actorHP = [],
	towerHP = [],
	grid = [],
	fog = [],
	gridW = 204.8,
	gridH = 204.8;


// **FOR TESTING ONLY. All actors will be drawn with spritesheet animations in the final version**
var spriteSheet;
var animatedSprite = {
	x: 900,
	y: 200
};
// **..**

function loadGame() {
	loadTerrain();
	loadFireBalls();
	loadActors();
	loadTowers();
	loadFlags();
	loadFog();
	loadHP();
	loadBases();
	animation(); // FOR TESTING ONLY
}

function getTerrain() {
	// below example for testing only
	// replace with code that reads from simulator

	return [
		[ 0, 1, 0, 0, 0, 2, 2, 0, 1, 2, 1, 1, 1, 0, 2, 1, 1, 1, 2, 0, 0, 0, 0, 2, 1, 0, 2, 1, 2, 0 ],
		[ 0, 0, 0, 2, 0, 2, 2, 0, 0, 1, 0, 1, 1, 2, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 0 ],
		[ 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 0, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 0, 2, 2, 2 ],
		[ 0, 2, 1, 0, 0, 2, 1, 0, 0, 1, 1, 0, 0, 1, 1, 2, 1, 2, 1, 1, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2 ],
		[ 2, 1, 1, 1, 0, 1, 1, 1, 2, 2, 0, 1, 2, 2, 0, 1, 0, 0, 0, 2, 2, 0, 2, 1, 0, 0, 0, 0, 2, 2 ],
		[ 2, 0, 1, 1, 0, 0, 1, 0, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 1, 1, 0, 1, 2, 0, 1, 0, 2, 1, 2, 1 ],
		[ 2, 2, 2, 1, 1, 2, 1, 0, 1, 2, 2, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2, 1, 2, 1 ],
		[ 0, 2, 1, 2, 1, 1, 0, 2, 2, 2, 1, 2, 1, 2, 1, 2, 0, 1, 2, 1, 1, 2, 0, 1, 2, 2, 0, 0, 0, 2 ],
		[ 0, 2, 2, 1, 2, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 2, 2, 1, 1, 0, 0, 0, 0, 2, 1, 1, 0, 1, 0, 2 ],
		[ 2, 1, 1, 2, 1, 2, 1, 0, 0, 2, 1, 0, 0, 1, 2, 2, 1, 2, 1, 0, 0, 1, 0, 2, 2, 0, 1, 2, 0, 1 ],
		[ 0, 0, 0, 1, 0, 0, 2, 1, 1, 1, 2, 1, 2, 0, 1, 0, 0, 1, 0, 0, 2, 0, 2, 1, 1, 2, 0, 0, 2, 2 ],
		[ 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 0, 0, 2, 2, 1, 1, 1, 0, 2, 1, 1, 0, 2 ],
		[ 1, 0, 1, 2, 1, 1, 0, 0, 1, 1, 1, 1, 2, 2, 1, 0, 2, 0, 1, 1, 2, 0, 1, 0, 0, 1, 0, 2, 0, 2 ],
		[ 2, 2, 2, 0, 2, 0, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 0, 2, 2, 0, 1, 1, 2, 0, 1, 1, 0, 0, 1, 1 ],
		[ 1, 2, 0, 1, 0, 2, 0, 1, 2, 2, 1, 0, 1, 1, 2, 0, 1, 1, 2, 2, 2, 0, 2, 0, 2, 2, 0, 2, 2, 2 ],
		[ 1, 2, 2, 0, 2, 2, 0, 1, 2, 0, 0, 2, 1, 1, 2, 2, 1, 2, 2, 0, 2, 1, 1, 1, 1, 0, 2, 0, 1, 0 ],
		[ 1, 1, 2, 1, 2, 0, 2, 0, 2, 2, 0, 2, 0, 0, 0, 1, 2, 1, 1, 1, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2 ],
		[ 1, 1, 1, 0, 2, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 2, 2, 1, 2, 0, 0, 2, 1, 0, 1, 2, 0, 1, 2, 2 ],
		[ 0, 1, 2, 2, 0, 2, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 1, 1, 0, 0, 1, 2, 1, 2, 2, 1, 0, 2 ],
		[ 1, 0, 2, 2, 2, 0, 1, 1, 0, 0, 1, 0, 2, 1, 1, 1, 1, 0, 1, 2, 0, 2, 2, 1, 0, 2, 0, 1, 2, 2 ],
		[ 1, 1, 0, 2, 0, 0, 1, 0, 0, 2, 1, 1, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 2, 1, 0, 0, 0, 2, 1 ],
		[ 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 2, 2, 1, 2, 0, 1, 0, 2, 0, 0, 2, 1, 1, 1, 1, 1, 2, 0, 2, 0 ],
		[ 2, 1, 2, 2, 2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 1, 1, 2, 2, 2, 2, 0, 1, 0, 0, 2, 1, 1 ],
		[ 1, 1, 1, 1, 0, 0, 1, 1, 2, 0, 1, 1, 1, 2, 2, 1, 2, 0, 2, 0, 0, 1, 0, 2, 0, 2, 0, 0, 2, 1 ],
		[ 0, 1, 1, 2, 0, 2, 0, 2, 0, 0, 1, 0, 2, 1, 0, 1, 1, 0, 2, 1, 1, 2, 2, 2, 2, 0, 1, 0, 2, 0 ],
		[ 1, 2, 0, 1, 2, 0, 0, 2, 0, 0, 0, 2, 2, 2, 2, 1, 0, 2, 1, 0, 0, 1, 1, 2, 1, 2, 2, 1, 1, 0 ],
		[ 2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 1, 1, 0, 2, 2, 1, 2, 1 ],
		[ 0, 1, 0, 1, 0, 1, 0, 2, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 2, 0, 1, 1, 2, 2, 2, 0, 0 ],
		[ 1, 0, 2, 0, 0, 2, 0, 0, 2, 0, 1, 2, 1, 1, 2, 1, 2, 2, 0, 1, 0, 2, 1, 0, 1, 0, 1, 1, 2, 2 ],
		[ 2, 0, 0, 1, 1, 2, 0, 2, 2, 1, 1, 1, 2, 1, 0, 1, 2, 1, 2, 1, 2, 0, 1, 2, 1, 1, 2, 2, 0, 0 ] 
	];


	// Load Terrain from File
/*  protobuf.load('./src/test/terrain.proto', function(err, root) {
		// var data = fs.readFileSync(`./src/ipc/terrain files/terrain_level${level}.txt`);
		var data = fs.readFileSync('./src/ipc/terrain files/terrain_level01.txt');
		var message = root.lookup("IPC.Terrain");
		var terrainTemp = message.decode(data);

		var terrainArray = [];
		for (var i = 0; i < terrainTemp.size; i++) {
			terrainArray[i] = [];
			for (var j = 0; j < terrainTemp.size; j++) {
				terrainArray[i][j] = terrainTemp.row[i].element[j].type;
			}
		}
		return terrainArray;
	});*/
}

function getVisiblityAll() {
	var arr = [];
	for (var i = 0; i < terrain.length; i++) {
		arr[i] = [];
		for (var j = 0; j < terrain.length; j++) {
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

			grid[i][j].setTransform(gridW * i, gridH * j, 0.8, 0.8);
			stage.addChild(grid[i][j]);
		}
	}

	map = {
		width: gridW * grid[0].length,
		height: gridH * grid.length
	};
	zoom.init = map.width;
}

function loadFog() {
	for (var i = 0; i < terrain.length; i++) {
		fog[i] = [];
		for (var j = 0; j < terrain[i].length; j++) {
			fog[i][j] = new PIXI.Sprite(PIXI.loader.resources.fog.texture);
			fog[i][j].setTransform(gridW * i, gridH * j, 0.8, 0.8);
			stage.addChild(fog[i][j]);
		}
	}
}

function loadActors() {
	for (var i = 0; i < actors.length; i++) {
		if (actors[i].actorType == 6) {
			if (!actors[i].attack)
				actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.sword.texture);
			else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.attack.texture);
		}
		// else if (actors[i].actorType === 0)
		//  actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.magician.texture);
		// else if (actors[i].actorType == 5)
		//  actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.cavalry.texture);
		else if (actors[i].actorType == 4)
			actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.king.texture);
		else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.actor.texture); //FOR TESTING

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
		else towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower0.texture);

		towers[i].currentID = towers[i].playerId;
		towers[i].lastSeenID = towers[i].playerId;
		towerSprites[i].setTransform(towers[i].x, towers[i].y);
		stage.addChild(towerSprites[i]);
	}
}

function loadHP() {
	for (var i = 0; i < actors.length; i++) {
		var health = actors[i].HP/actors[i].maxHP;
		actorHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		actorHP[i].setTransform(actors[i].x - 5, actors[i].y - 12, health, 1);
		stage.addChild(actorHP[i]);
	}
	for (var i = 0; i < towers.length; i++) {
		var health = towers[i].HP/towers[i].maxHP;
		towerHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		towerHP[i].setTransform(towers[i].x - 5, towers[i].y - 12, health, 1);
		stage.addChild(towerHP[i]);
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
	for (var i = 0; i < fireBalls.length; i++) {
		fireBallSprites[i] = new PIXI.Sprite(PIXI.loader.resources.fireBall.texture);

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

function animation() {
	var base = PIXI.loader.resources.running.texture;

	var textures = [];
	for (var i = 0; i < 10; i++) {
		var frameTexture = new PIXI.Texture(base);
		frameTexture.frame = new PIXI.Rectangle(32 * i, 0, 17, 24);
		textures[i] = frameTexture;
	}

	spriteSheet = new PIXI.extras.AnimatedSprite(textures);
	spriteSheet.position.set(animatedSprite.x, animatedSprite.y);
	spriteSheet.scale.set(1.25);
	spriteSheet.animationSpeed = 0.35;
	spriteSheet.play();
	stage.addChild(spriteSheet);
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

function endGame() {
	while (stage.children.length > 1) {
		n = stage.getChildAt(1);
		stage.removeChild(n);
	}
	setTimeout(fadeIn, 500);
}
