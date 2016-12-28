const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame;

var width = window.innerWidth,
	height = window.innerHeight;

var stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var map,
	grid = [],
	gridW = 204.8,
	gridH = 204.8;

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
	zoom: 1
};

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
	.load(setup);

function setup() {
	loadTerrain();
	loadActor();
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

function loadTerrain() {
	var terrain = getTerrain();

	for (var i = 0; i < terrain.length; i++) {
		grid[i] = [];
		for (var j = 0; j < terrain.length; j++) {
			if (terrain[i][j] === 'P')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.plain.texture);
			else if (terrain[i][j] === 'M')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.mountain.texture);
			else if (terrain[i][j] === 'F')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.forest.texture);

			grid[i][j].scale.set(0.8, 0.8);
			grid[i][j].position.set(gridW * i, gridH * j);

			stage.addChild(grid[i][j]);
		}
	}

	map = {
		width: gridW * grid[0].length,
		height: gridH * grid.length
	};
}

function getSprite() {
	return {
		"actors" : [{
			"id" : 0,
			"x"  : 0,
			"y"	 : 0
		},
		{
			"id" : 1,
			"x"  : 150,
			"y"	 : 200
		}]
	};
}

function loadActor() {
	var Sprite = getSprite();
	var display;
	var actorsLength = Sprite.actors.length;		
	for(var i = 0; i< actorsLength; i++) { 
		display = new PIXI.Sprite(PIXI.loader.resources.actor.texture);
		display.scale.x = 0.5;
		display.scale.y = 0.5;
		display.position.x = Sprite.actors[i].x;
		display.position.y = Sprite.actors[i].y;
		stage.addChild(display);
	}
}

function render() {
	// Initial variable update before each frame is rendered
	init();

	// Panning and Zooming Functions
	screenPosition();
	screenZoom();

	// Dynamic Resizing
	if (renderer.width != width || renderer.height != height) {
		renderer.resize(width, height);
		document.body.appendChild(renderer.view);
	}

	stage.setTransform(camera.zoom * camera.x, camera.zoom * camera.y, camera.zoom, camera.zoom);
	correction();

	renderer.render(stage);
	requestAnimationFrame(render);
}

function init() {
	width = window.innerWidth;
	height = window.innerHeight;
	map.x = grid[0][0].x;
	map.y = grid[0][0].y;
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
	if (!(zoom.in && zoom.out)) {
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

function correction() {
	var change = {
		x: -(1 - 1 / camera.zoom) * width / 2,
		y: -(1 - 1 / camera.zoom) * height / 2
	};

	for (var i in grid) {
		for (var j in grid[i]) {
			grid[i][j].setTransform(change.x + gridW * i, change.y + gridH * j);
		}
	}
}
