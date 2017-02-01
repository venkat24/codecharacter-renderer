var protobuf = require('protobufjs');
var path = require('path');
var spawn = require('child_process').spawn;
var child = spawn('./src/ipc/ipc');
var fs = require('fs');

const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.send('pid-message', child.pid);

var stateVariable,
	tempState = [],
	actors = [],
	towers = [],
	flags = [],
	fireBalls = [],
	bases = [],
	x = 396;
// var visibilityArray = [ , , getVisiblityAll()];

child.stdout.on('data', (data) => {
	// console.log(data.toString());
	protobuf.load('./src/ipc/proto/state.proto', function(err, root) {
		var message = root.lookup("IPC.State");
		decode(data, message);
	});
});

function decode(data, message) {
	stateVariable = message.decode(data);
	if (stateVariable.actors[0].posX.low - x > 1)
		console.log(stateVariable.actors[0].posX.toString() + " ...... Skiped from..." + x );
	x = stateVariable.actors[0].posX.low;
	setArrays();
}


function setArrays() {
	tempState = stateVariable.actors.slice();
	if (tempState.length > stateVariable.number.low)
		tempState.splice(stateVariable.number.low, tempState.length - stateVariable.number.low);

	var actorCount = 0,
		towerCount = 0,
		flagCount = 0,
		baseCount = 0,
		fireBallCount = 0;

	for (var i = 0; i < tempState.length; i++) {
		if (tempState[i].actorType == 1) {
			fireBalls[fireBallCount] = {};
			for (var j in tempState[i]) {
				fireBalls[fireBallCount][j] = tempState[i][j].low;
			}
			fireBalls[fireBallCount].x = fireBalls[fireBallCount].posX;
			fireBalls[fireBallCount].y = fireBalls[fireBallCount].posY;
			fireBalls[fireBallCount].center = {};
			fireBallCount++;
		}
		else if (tempState[i].actorType == 2) {
			bases[baseCount] = {};
			for (var j in tempState[i]) {
				bases[baseCount][j] = tempState[i][j].low;
			}
			bases[baseCount].x = bases[baseCount].posX;
			bases[baseCount].y = bases[baseCount].posY;
			bases[baseCount].center = {};
			baseCount++;
		}
		else if (tempState[i].actorType == 3) {
			flags[flagCount] = {};
			for (var j in tempState[i]) {
				flags[flagCount][j] = tempState[i][j].low;
			}
			flags[flagCount].x = flags[flagCount].posX;
			flags[flagCount].y = flags[flagCount].posY;
			flags[flagCount].center = {};
			flagCount++;
		}
		else if (tempState[i].actorType == 7) {
			towers[towerCount] = {};
			for (var j in tempState[i]) {
				towers[towerCount][j] = tempState[i][j].low;
			}
			towers[towerCount].x = towers[towerCount].posX;
			towers[towerCount].y = towers[towerCount].posY;
			towers[towerCount].center = {};
			towerCount++;
		}
		else {
			actors[actorCount] = {};
			for (var j in tempState[i]) {
				if (typeof(tempState[i][j]) == "boolean" || j == 'actorType') {
					actors[actorCount][j] = tempState[i][j];
				}
				else actors[actorCount][j] = tempState[i][j].low;
			}
			actors[actorCount].x = actors[actorCount].posX;
			actors[actorCount].y = actors[actorCount].posY;
			actors[actorCount].center = {};
			actorCount++;
		}
	}


	terrainVisibility1 = [];
	terrainVisibility2 = [];
	for (var i = 0; i < 20; i++) {
		terrainVisibility1[i] = [];
		terrainVisibility2[i] = [];
		for (var j = 0; j < 20; j++) {
			terrainVisibility1[i][j] = stateVariable.player1Los.grid[i].losElement[j];
			terrainVisibility2[i][j] = stateVariable.player2Los.grid[i].losElement[j];
		}
	}

	// visibilityArray[0] = terrainVisibility1;
	// visibilityArray[1] = terrainVisibility2;
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

var terrain = getTerrain(); // FOR TESTING ONLY.
	visibilityArray = [getVisiblityAll(), getVisiblity1(), getVisiblity2()]; // FOR TESTING ONLY

// ****For Testing Purposes. To Replace with Data Received from Simulator****
// var actors = [
// 	{
// 		id: 0,
// 		x: 100,
// 		y: 15
// 	},
// 	{
// 		id: 1,
// 		x: 200,
// 		y: 200
// 	},
// 	{
// 		id: 2,
// 		x: 1300,
// 		y: 100,
// 		actorType: 'sword',
// 		attack: false,
// 		playerId: 2,
// 		HP: 40,
// 		maxHP: 200
// 	},
// 	{
// 		id: 3,
// 		x: 750,
// 		y: 650,
// 		actorType: 'sword',
// 		attack: true,
// 		playerId: 1,
// 		HP: 200,
// 		maxHP: 200
// 	},
// 	{
// 		id: 4,
// 		x: 250,
// 		y: 850,
// 		actorType: 'king',
// 		playerId: 1,
// 		HP: 300,
// 		maxHP: 800
// 	}
// ];

// var towers = [
// 	{
// 		id: 1,
// 		x: 200,
// 		y: 500,
// 		playerId: 0,
// 		HP: 5000,
// 		maxHP: 5000
// 	},
// 	{
// 		id: 2,
// 		x: 1200,
// 		y: 200,
// 		playerId: 1,
// 		HP: 2000,
// 		maxHP: 5000
// 	},
// 	{
// 		id: 3,
// 		x: 390,
// 		y: 500,
// 		playerId: 2,
// 		HP: 4000,
// 		maxHP: 5000
// 	},

// ];

// var flags = [
// 	{
// 		id: 1,
// 		x: 1300,
// 		y: 700,
// 		playerId: 1
// 	},
// 	{
// 		id: 2,
// 		x: 600,
// 		y: 10,
// 		playerId: 2
// 	},
// ];

// var fireBalls = [
// 	{
// 		id: 1,
// 		x: 470,
// 		y: 500
// 	}
// ];

// var bases = [
// 	{
// 		playerId: 1,
// 		x: 306,
// 		y: 717
// 	},
// 	{
// 		playerId: 2,
// 		x: 1945,
// 		y: 716
// 	}
// ];

// **FOR TESTING ONLY. All actors will be drawn with spritesheet animations in the final version**
var spriteSheet;
var animatedSprite = {
	x: 900,
	y: 200
};
// **..**

// ****...****

// For animation testing purposes
var temp = 0;

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
	setTimeout(fadeIn, 500);
}

function getTerrain() {
	// below example for testing only
	// replace with code that reads from simulator

	return [
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'M', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
		['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
		['P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
	];

	// Load Terrain from File
/*	protobuf.load('./src/test/terrain.proto', function(err, root) {
		var data = fs.readFileSync('terrain' + level + '.txt');
		var message = root.lookup("IPC.Terrain");
		return message.decode(data);
	});*/
}

function getVisiblity1() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		[ 0, 1, 1, 2, 2, 1, 2, 1, 2, 2, 2, 0, 0, 2, 0, 1, 0, 0, 2, 1 ],
		[ 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 0, 0, 1, 0, 1 ],
		[ 1, 1, 1, 0, 0, 2, 1, 2, 1, 0, 0, 2, 1, 2, 2, 1, 2, 1, 0, 0 ],
		[ 0, 1, 2, 0, 2, 0, 1, 1, 1, 2, 1, 0, 0, 0, 2, 2, 2, 1, 1, 0 ],
		[ 0, 1, 2, 1, 1, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 1, 1, 1, 1, 2 ],
		[ 0, 0, 0, 0, 2, 2, 1, 2, 0, 1, 2, 0, 0, 1, 2, 2, 2, 0, 0, 2 ],
		[ 1, 0, 2, 1, 2, 2, 0, 0, 2, 1, 1, 1, 2, 1, 0, 0, 0, 2, 0, 0 ],
		[ 1, 2, 1, 0, 0, 1, 2, 0, 2, 0, 1, 2, 1, 1, 2, 0, 1, 0, 0, 0 ],
		[ 2, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 2, 2, 2, 2, 0, 0, 1 ],
		[ 2, 1, 0, 2, 2, 2, 0, 1, 1, 2, 1, 0, 1, 1, 2, 1, 2, 1, 1, 1 ],
		[ 2, 1, 0, 2, 2, 0, 0, 2, 0, 1, 2, 0, 0, 0, 2, 0, 1, 2, 0, 2 ],
		[ 1, 0, 0, 1, 2, 0, 0, 0, 1, 0, 1, 2, 0, 1, 1, 0, 2, 2, 2, 1 ],
		[ 1, 1, 0, 2, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1, 0, 2, 2, 1, 1, 2 ],
		[ 2, 1, 2, 1, 0, 0, 1, 1, 0, 2, 1, 2, 0, 0, 0, 1, 0, 0, 2, 0 ],
		[ 1, 1, 0, 2, 1, 1, 1, 2, 0, 1, 2, 1, 2, 2, 1, 1, 1, 0, 0, 2 ],
		[ 0, 1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 1, 0, 2, 2, 1, 1, 0, 0, 1 ],
		[ 2, 1, 2, 0, 0, 0, 2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1 ],
		[ 1, 1, 0, 2, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0, 0, 1, 1 ],
		[ 2, 2, 2, 1, 1, 0, 1, 1, 2, 0, 2, 1, 0, 1, 1, 0, 1, 0, 2, 2 ],
		[ 0, 0, 1, 2, 2, 2, 0, 0, 2, 2, 1, 1, 2, 1, 2, 0, 2, 2, 0, 1 ]
	];
}

function getVisiblity2() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		[ 1, 0, 2, 1, 2, 0, 2, 0, 2, 0, 1, 1, 0, 1, 1, 1, 1, 0, 2, 0 ],
		[ 2, 1, 2, 2, 0, 1, 2, 0, 1, 0, 1, 2, 2, 1, 1, 2, 2, 2, 0, 2 ],
		[ 2, 2, 0, 1, 2, 1, 1, 1, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 2, 0 ],
		[ 1, 1, 1, 0, 1, 1, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 1, 0, 1, 1 ],
		[ 0, 2, 2, 2, 1, 0, 1, 0, 1, 2, 1, 0, 0, 0, 2, 2, 2, 1, 1, 0 ],
		[ 2, 2, 2, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 1, 2, 2, 2, 2, 2, 1 ],
		[ 0, 2, 2, 1, 2, 2, 1, 2, 0, 2, 1, 2, 1, 0, 0, 2, 0, 1, 1, 1 ],
		[ 2, 2, 2, 1, 0, 1, 2, 0, 0, 0, 1, 0, 2, 2, 0, 2, 2, 0, 1, 2 ],
		[ 1, 2, 0, 2, 1, 2, 0, 0, 2, 0, 1, 2, 1, 1, 0, 2, 1, 0, 0, 1 ],
		[ 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 2, 0, 2, 2, 2, 0, 2 ],
		[ 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1, 0, 0, 2, 0, 2, 1, 2, 1 ],
		[ 1, 0, 1, 2, 2, 2, 0, 1, 0, 2, 2, 1, 1, 0, 2, 1, 1, 1, 2, 2 ],
		[ 1, 0, 1, 0, 2, 2, 1, 1, 0, 1, 0, 1, 2, 1, 0, 0, 2, 0, 0, 1 ],
		[ 2, 2, 2, 2, 0, 1, 2, 0, 0, 2, 2, 2, 1, 0, 2, 2, 0, 2, 1, 1 ],
		[ 2, 1, 1, 1, 0, 0, 1, 2, 0, 2, 1, 2, 0, 2, 1, 0, 1, 2, 1, 2 ],
		[ 2, 2, 0, 0, 1, 0, 0, 1, 1, 2, 1, 1, 0, 0, 1, 0, 2, 1, 2, 2 ],
		[ 2, 1, 2, 1, 2, 1, 2, 0, 1, 1, 1, 0, 2, 0, 2, 2, 2, 0, 2, 1 ],
		[ 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 1, 1, 2, 0 ],
		[ 1, 1, 1, 2, 1, 1, 1, 2, 2, 0, 2, 0, 1, 1, 2, 2, 2, 2, 0, 1 ],
		[ 0, 2, 2, 0, 1, 1, 2, 2, 1, 2, 1, 0, 1, 1, 2, 1, 1, 0, 2, 1 ]
	];
}

function getVisiblityAll() {
	var arr = [];
	for (var i = 0; i < 20; i++) {
		arr[i] = [];
		for (var j = 0; j < 20; j++) {
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
			if (terrain[i][j] === 'P')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.plain.texture);
			else if (terrain[i][j] === 'M')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.mountain.texture);
			else if (terrain[i][j] === 'F')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.forest.texture);

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
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.magician.texture);
		// else if (actors[i].actorType == 5)
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.cavalry.texture);
		else if (actors[i].actorType == 4)
			actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.king.texture);
		else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.actor.texture); //FOR TESTING

		actors[i].center = {};
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

		towers[i].center = {};
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

		fireBalls[i].center = {};
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
