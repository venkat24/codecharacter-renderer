const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame;

var width = window.innerWidth,
	height = window.innerHeight;

var stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var map;

var camera = {
	x: 0,
	y: 0,
	zoom: 1
};

document.body.appendChild(renderer.view);
document.body.addEventListener("keydown", function(e) {
	if (e.keyCode == 37) {
		camera.x += 10;
	}
	if (e.keyCode == 38) {
		camera.y += 10;
	}
	if (e.keyCode == 39) {
		camera.x -= 10;
	}
	if (e.keyCode == 40) {
		camera.y -= 10;
	}
	if (e.keyCode == 107) {
		camera.zoom *= 1.25;
	}
	if (e.keyCode == 109) {
		camera.zoom /= 1.25;
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
		['P', 'P', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
	];

}

function loadTerrain() {
	var terrain = getTerrain();

	var gridW = renderer.width / terrain.length | 0;
	var gridH = renderer.height / terrain.length | 0;

	var grid;
	for (var i = 0; i < terrain.length; i++) {
		for (var j = 0; j < terrain.length; j++) {
			if (terrain[i][j] === 'P')
				grid = new PIXI.Sprite(PIXI.loader.resources.plain.texture);
			else if (terrain[i][j] === 'M')
				grid = new PIXI.Sprite(PIXI.loader.resources.mountain.texture);
			else if (terrain[i][j] === 'F')
				grid = new PIXI.Sprite(PIXI.loader.resources.forest.texture);

			grid.scale.x = 0.5;
			grid.scale.y = 0.5;

			grid.position.x = gridW * i;
			grid.position.y = gridH * j | 0;

			stage.addChild(grid);
		}
	}
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
	// Dynamic resizing (or automatically strech renderer to full screen)
	stage.setTransform(camera.zoom * camera.x, camera.zoom * camera.y, camera.zoom, camera.zoom);
	// correction();

	renderer.render(stage);
	requestAnimationFrame(render);
}

function correction() {
	var change = {
		x: -(1 - 1 / camera.zoom) * width / 2,
		y: -(1 - 1 / camera.zoom) * height / 2
	};
	map.setTransform(change.x, change.y);
}
