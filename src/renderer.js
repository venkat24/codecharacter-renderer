const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame; 

var	width = window.innerWidth,
	height = window.innerHeight;

var	stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var map;

var camera = {
	x: 0,
	y: 0,
	zoom: 1
};

document.body.appendChild(renderer.view);
document.body.addEventListener("keydown", function (e) {
	if(e.keyCode == 37) {
		camera.x += 10;
	}
	if(e.keyCode == 38) {
		camera.y += 10;
	}	
	if(e.keyCode == 39) {
		camera.x -= 10;
	}
	if (e.keyCode == 40) {
		camera.y -= 10;
	}
	if(e.keyCode == 107) {
		camera.zoom *= 1.25;
	}
	if(e.keyCode == 109) {
		camera.zoom /= 1.25;
	}
});

PIXI.loader
	.add("map", "./assets/map.jpg")
	.load(setup);

function setup() {
	map = new PIXI.Sprite(PIXI.loader.resources.map.texture);
	stage.addChild(map);
	render();
}

function render() {
	// Dynamic resizing (or automatically strech renderer to full screen)
	stage.setTransform(camera.zoom*camera.x, camera.zoom*camera.y, camera.zoom, camera.zoom);
	correction();		

	renderer.render(stage);
	requestAnimationFrame(render);
}

function correction() {
	var change = {
		x: -(1 - 1/camera.zoom)*width/2,
		y: -(1 - 1/camera.zoom)*height/2
	};	
	map.setTransform(change.x, change.y);
}

