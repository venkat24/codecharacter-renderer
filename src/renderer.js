const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame;

var width = window.innerWidth,
	height = window.innerHeight;

var stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var map,
	terrain,
	actorSprites = [],
	towerSprites = [],
	flagSprites = [],
	arrowSprites = [],
	actorHP = [],
	towerHP = [],
	grid = [],
	gridW = 204.8,
	gridH = 204.8;

// ****For Testing Purposes. To Replace with Data Received from Simulator****
var actors = [
	{
		id: 0,
		x: 100,
		y: 15
	},
	{
		id: 1,
		x: 200,
		y: 200
	},
	{
		id: 2,
		x: 1300,
		y: 100,
		actorType: 'sword',
		attack: false,
		playerID: 2,
		HP: 40,
		maxHP: 200
	},
	{
		id: 3,
		x: 750,
		y: 650,
		actorType: 'sword',
		attack: true,
		playerID: 1,
		HP: 200,
		maxHP: 200
	},
	{
		id: 4,
		x: 250,
		y: 850,
		actorType: 'king',
		playerID: 1,
		HP: 300,
		maxHP: 800
	}
];

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
		x: 400,
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

var arrows = [
	{
		id: 1,
		x: 470,
		y: 500,
		rotation: -Math.PI/5
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

var up = false,
	down = false,
	left = false,
	right = false,
	zoom = {
		in: false,
		out: false,
		val: 1
	};

var camera = {
	x: 0,
	y: 0,
	vel: {
		x: 0,
		y: 0,
		zoom: 0
	},
	zoom: 0.6
};

// For animation testing purposes
var temp = 0;

document.body.appendChild(renderer.view);
document.body.addEventListener("keydown", function(e) {
	if (e.keyCode == 37) {
		left = true;
	}
	if (e.keyCode == 38) {
		up = true;
	}
	if (e.keyCode == 39) {
		right = true;
	}
	if (e.keyCode == 40) {
		down = true;
	}
	if (e.keyCode == 187) {
		zoom.in = true;
	}
	if (e.keyCode == 189) {
		zoom.out = true;
	}
});
document.body.addEventListener("keyup", function (e) {
	if (e.keyCode == 37) {
		left = false;
	}
	if (e.keyCode == 38) {
		up = false;
	}
	if (e.keyCode == 39) {
		right = false;
	}
	if (e.keyCode == 40) {
		down = false;
	}
	if (e.keyCode == 187) {
		zoom.in = false;
	}
	if (e.keyCode == 189) {
		zoom.out = false;
	}
});

PIXI.loader
	.add("forest", "./assets/forest.jpg")
	.add("plain", "./assets/plains.jpg")
	.add("mountain", "./assets/mountain.jpg")
	.add("actor", "./assets/bunny.png")
	.add("sword", "./assets/swordsman.png")
	.add("attack", "./assets/attack.png")
	// .add("archer", "./assets/archer.png")
	// .add("cavalry", "./assets/cavalry.png")
	.add("king", "./assets/king.png")
	.add("tower0", "./assets/tower0.png")
	.add("tower1", "./assets/tower1.png")
	.add("tower2", "./assets/tower2.png")
	.add("flag1", "./assets/flag1.png")
	.add("flag2", "./assets/flag2.png")
	.add("arrow", "./assets/arrow.png")
	.add("hp", "./assets/hp.jpg")
	.add("running", "./assets/running.png") // FOR TESTING ONLY. There will be no 'running' asset in the final version.
	.load(setup);

function setup() {
	loadTerrain();
	loadActors();
	loadTowers();
	loadFlags();
	loadArrows();
	spriteSheet(); // FOR TESTING ONLY
	render();
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
}

function getVisiblity() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		[ 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1 ],
		[ 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1 ],
		[ 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0 ],
		[ 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1 ],
		[ 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1 ],
		[ 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0 ],
		[ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1 ],
		[ 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1 ],
		[ 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1 ],
		[ 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0 ],
		[ 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1 ],
		[ 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1 ],
		[ 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1 ],
		[ 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1 ],
		[ 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1 ],
		[ 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0 ],
		[ 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1 ],
		[ 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1 ],
		[ 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1 ]
	];
}

function loadTerrain() {
	terrain = getTerrain(); // FOR TESTING ONLY.
	terrainVisibility = getVisiblity(); // FOR TESTING ONLY.

	for (var i in terrain) {
		grid[i] = [];
		for (var j in terrain[i]) {
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
}

function loadActors() {
	for (var i in actors) {
		if (actors[i].actorType == 'sword') {
			if (!actors[i].attack)
				actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.sword.texture);
			else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.attack.texture);
		}
		// else if (actors[i].actorType == 'archer')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.archer.texture);
		// else if (actors[i].actorType == 'cavalry')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.cavalry.texture);
		else if (actors[i].actorType == 'king')
			actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.king.texture);
		else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.actor.texture); //FOR TESTING

		var health = actors[i].HP/actors[i].maxHP;
		actorHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);

		actors[i].center = {};
		actorSprites[i].setTransform(actors[i].x, actors[i].y);
		actorHP[i].setTransform(actors[i].x - 5, actors[i].y - 12, health, 1);
		stage.addChild(actorSprites[i]);
		stage.addChild(actorHP[i]);
	}
}

function loadTowers() {
	for (var i in towers) {
		if (towers[i].playerID == 0)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower0.texture);
		else if (towers[i].playerID == 1)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower1.texture);
		else if (towers[i].playerID == 2)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower2.texture);

		var health = towers[i].HP/towers[i].maxHP;
		towerHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);

		towers[i].center = {};
		towers[i].currentID = towers[i].playerID;
		towerSprites[i].setTransform(towers[i].x, towers[i].y);
		towerHP[i].setTransform(towers[i].x - 5, towers[i].y - 12, health, 1);
		stage.addChild(towerSprites[i]);
		stage.addChild(towerHP[i]);
	}
}

function loadFlags() {
	for (var i in flags) {
		if (flags[i].playerID == 1)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag1.texture);
		if (flags[i].playerID == 2)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag2.texture);

		flags[i].center = {};
		flagSprites[i].setTransform(flags[i].x, flags[i].y);
		stage.addChild(flagSprites[i]);
	}
}

function loadArrows() {
	for (var i in arrows) {
		arrowSprites[i] = new PIXI.Sprite(PIXI.loader.resources.arrow.texture);

		arrows[i].center = {};
		arrowSprites[i].setTransform(arrows[i].x, arrows[i].y, 1, 1, arrows[i].rotation);
		stage.addChild(arrowSprites[i]);
	}
}

function spriteSheet() {
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

function render() {
	// Initial variable update before each frame is rendered
	init();

	// For animation testing purposes
	test();

	// Panning and Zooming Functionality
	screenPosition();
	screenZoom();
	stage.setTransform(camera.zoom * camera.x, camera.zoom * camera.y, camera.zoom, camera.zoom);

	// Dynamic Resizing
	if (renderer.width != width || renderer.height != height) {
		renderer.resize(width, height);
		document.body.appendChild(renderer.view);
	}

	// Object Position Update
	update();

	renderer.render(stage);
	requestAnimationFrame(render);
}

function init() {
	width = window.innerWidth;
	height = window.innerHeight;
	map.x = grid[0][0].x;
	map.y = grid[0][0].y;

	for (var i in actorSprites) {
		findCenter(actors[i], actorSprites[i]);
	}
	for (var i in towerSprites) {
		findCenter(towers[i], towerSprites[i]);
	}
	for (var i in flagSprites) {
		findCenter(flags[i], flagSprites[i]);
	}
	for (var i in arrowSprites) {
		findCenter(arrows[i], arrowSprites[i]);
	}
}

function findCenter(object, sprite) {
	object.center.x = object.x + sprite.width/2;
	object.center.y = object.y + sprite.height/2;
}

function test() {
	temp ++;
	for (var i in actors) {
		if (!actors[i].actorType)
			actors[i].x += 5 * Math.sin(temp/25);
	}
}

function screenPosition() {
	if ( !(up && down) ) {
		if (up && camera.vel.y < 16)
			camera.vel.y += 1.6;
		if (down && camera.vel.y > -16)
			camera.vel.y -= 1.6;
	}

	if ( !(left && right) ) {
		if (left && camera.vel.x < 16)
			camera.vel.x += 1.6;
		if (right && camera.vel.x > -16)
			camera.vel.x -= 1.6;
	}

	if (camera.vel.x < 0.01 && camera.vel.x > -0.01)
		camera.vel.x = 0;
	if (camera.vel.y < 0.01 && camera.vel.y > -0.01)
		camera.vel.y = 0;

	camera.vel.x *= 0.85;
	camera.vel.y *= 0.85;

	camera.x += camera.vel.x;
	camera.y += camera.vel.y;

	if (map.x + camera.x > 0) {
		camera.vel.x = 0;
		camera.x = -0.01 - map.x;
	}
	if (map.x + camera.x < width/camera.zoom - map.width) {
		camera.vel.x = 0;
		camera.x = 0.01 + width/camera.zoom - map.width - map.x;
	}
	if (map.y + camera.y > 0) {
		camera.vel.y = 0;
		camera.y = -0.01 - map.y;
	}
	if (map.y + camera.y < height/camera.zoom - map.height) {
		camera.vel.y = 0;
		camera.y = 0.01 + height/camera.zoom - map.height - map.y;
	}
}

function screenZoom() {
	if ( !(zoom.in && zoom.out) ) {
		if (camera.zoom < 2) {
			if (zoom.in && camera.vel.zoom < 0.02)
				camera.vel.zoom += 0.005;
		}
		if (camera.zoom > 0.5) {
			if (zoom.out && camera.vel.zoom > -0.02)
				camera.vel.zoom -= 0.005;
		}
	}

	if (camera.vel.zoom < 0.001 && camera.vel.zoom > -0.001)
		camera.vel.zoom = 0;

	camera.vel.zoom *= 0.85;
	camera.zoom += camera.vel.zoom;

	// To Use For MOUSE SCROLL ZOOMING
/*	if (Math.abs(camera.zoom - zoom.val) > 0.02) {
		if (camera.zoom < zoom.val)
			camera.zoom += 0.02;
		else if (camera.zoom > zoom.val)
			camera.zoom -= 0.02;
	}
*/
}

function update() {
	var change = {
		x: -(1 - 1 / camera.zoom) * width / 2,
		y: -(1 - 1 / camera.zoom) * height / 2
	};

	for (var i in grid) {
		for (var j in grid[i]) {
			grid[i][j].setTransform(change.x + gridW * i, change.y + gridH * j, 0.8, 0.8);
			if (!terrainVisibility[i][j])
				grid[i][j].visible = false;
			else grid[i][j].visible = true;
		}
	}
	for (var i in actorSprites) {
		actorSprites[i].setTransform(actors[i].x + change.x, actors[i].y + change.y);
		if (!visibility(actors[i]))
			actorSprites[i].visible = false;
		else actorSprites[i].visible = true;
	}
	for (var i in actorHP) {
		var health = actors[i].HP / actors[i].maxHP;
		actorHP[i].setTransform(actors[i].x + change.x - 5, actors[i].y + change.y - 12, health, 1);
		if (!actorSprites[i].visible)
			actorHP[i].visible = false;
		else actorHP[i].visible = true;
	}
	for (var i in towerSprites) {
		if (towers[i].currentID != towers[i].playerID) {
			if (towers[i].playerID == 0)
				towerSprites[i].texture = PIXI.loader.resources.tower0.texture;
			else if (towers[i].playerID == 1)
				towerSprites[i].texture = PIXI.loader.resources.tower1.texture;
			else if (towers[i].playerID == 2)
				towerSprites[i].texture = PIXI.loader.resources.tower2.texture;
		}

		towerSprites[i].setTransform(towers[i].x + change.x, towers[i].y + change.y);
		if (!visibility(towers[i]))
			towerSprites[i].visible = false;
		else towerSprites[i].visible = true;
	}
	for (var i in towerHP) {
		var health = towers[i].HP / towers[i].maxHP;
		towerHP[i].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 12, health, 1);
		if (!towerSprites[i].visible)
			towerHP[i].visible = false;
		else towerHP[i].visible = true;
	}
	for (var i in flagSprites) {
		flagSprites[i].setTransform(flags[i].x + change.x, flags[i].y + change.y);
		if (!visibility(flags[i]))
			flagSprites[i].visible = false;
		else flagSprites[i].visible = true;
	}
	for (var i in arrowSprites) {
		arrowSprites[i].setTransform(arrows[i].x + change.x, arrows[i].y + change.y, 1, 1, arrows[i].rotation);
		if (!visibility(arrows[i]))
			arrowSprites[i].visible = false;
		else arrowSprites[i].visible = true;
	}

	// FOR TESTING ONLY
	spriteSheet.setTransform(animatedSprite.x + change.x, animatedSprite.y + change.y, 1.25, 1.25);
}

function visibility(object) {
	var x = Math.floor(object.center.x / gridW),
		y = Math.floor(object.center.y / gridH);
	return terrainVisibility[x][y];
}
