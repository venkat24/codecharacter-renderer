var protobuf = require('protobufjs');
var path = require('path');
var spawn = require('child_process').spawn;
var child = spawn('./src/test/ipc');
var fs = require('fs');

const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.send('pid-message', child.pid);

var stateVariable;
var actors = [];
var x = 396;
// var visibilityArray = [ , , getVisiblityAll()];

child.stdout.on('data', (data) => {
	// console.log(data.toString());
	protobuf.load('./src/test/state.proto', function(err, root) {
		var message = root.lookup("IPC.State");
		decode(data, message);
	});
});

function decode(data, message) {
	stateVariable = message.decode(data);
	if (stateVariable.actors[0].posX.low - x > 1)
		console.log(stateVariable.actors[0].posX.toString() + " ...... Skiped..." + x );
	x = stateVariable.actors[0].posX.low;
	setArrays();
}


function setArrays() {
	for (var i = 0; i < stateVariable.actors.length; i++) {
		actors[i] = {};
		for (var j in stateVariable.actors[i]) {
			if (typeof(stateVariable.actors[i][j]) == "boolean" || j == 'actorType') {
				actors[i][j] = stateVariable.actors[i][j];
			}
			else actors[i][j] = stateVariable.actors[i][j].low;
		}
		actors[i].x = actors[i].posX;
		actors[i].y = actors[i].posY;
		actors[i].center = {};
	}

	if (actors.length > stateVariable.number.low)
		actors.splice(stateVariable.number.low, actors.length - stateVariable.number.low);

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
// 		playerID: 2,
// 		HP: 40,
// 		maxHP: 200
// 	},
// 	{
// 		id: 3,
// 		x: 750,
// 		y: 650,
// 		actorType: 'sword',
// 		attack: true,
// 		playerID: 1,
// 		HP: 200,
// 		maxHP: 200
// 	},
// 	{
// 		id: 4,
// 		x: 250,
// 		y: 850,
// 		actorType: 'king',
// 		playerID: 1,
// 		HP: 300,
// 		maxHP: 800
// 	}
// ];

var towers = [
	{
		id: 1,
		x: 200,
		y: 500,
		playerID: 0,
		HP: 5000,
		maxHP: 5000
	},
	{
		id: 2,
		x: 1200,
		y: 200,
		playerID: 1,
		HP: 2000,
		maxHP: 5000
	},
	{
		id: 3,
		x: 390,
		y: 500,
		playerID: 2,
		HP: 4000,
		maxHP: 5000
	},

];

var flags = [
	{
		id: 1,
		x: 1300,
		y: 700,
		playerID: 1
	},
	{
		id: 2,
		x: 600,
		y: 10,
		playerID: 2
	},
];

var fireBalls = [
	{
		id: 1,
		x: 470,
		y: 500
	}
];

var bases = [
	{
		playerID: 1,
		x: 306,
		y: 717
	},
	{
		playerID: 2,
		x: 1945,
		y: 716
	}
];

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
		if (actors[i].actorType == 'sword') {
			if (!actors[i].attack)
				actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.sword.texture);
			else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.attack.texture);
		}
		// else if (actors[i].actorType == 'magician')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.magician.texture);
		// else if (actors[i].actorType == 'cavalry')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.cavalry.texture);
		else if (actors[i].actorType == 'king')
			actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.king.texture);
		else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.actor.texture); //FOR TESTING

		actors[i].center = {};
		actorSprites[i].setTransform(actors[i].x, actors[i].y);
		stage.addChild(actorSprites[i]);
	}
}

function loadTowers() {
	for (var i = 0; i < towers.length; i++) {
		if (towers[i].playerID == 0)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower0.texture);
		else if (towers[i].playerID == 1)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower1.texture);
		else if (towers[i].playerID == 2)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower2.texture);

		towers[i].center = {};
		towers[i].currentID = towers[i].playerID;
		towers[i].lastSeenID = towers[i].playerID;
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
		if (flags[i].playerID == 1)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag1.texture);
		if (flags[i].playerID == 2)
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
