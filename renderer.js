// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

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
	if(e.keyCode == 37 && map.x + camera.x <= -10) {
		camera.x += 10;
	}
		
	if(e.keyCode == 38 && map.y + camera.y <= -10) {
		camera.y += 10;
	}	
	
	if(e.keyCode == 39 && map.x + camera.x >= width/camera.zoom - map.width + 10) {
		camera.x -= 10;
	}
		
	if (e.keyCode == 40 && map.y + camera.y >= height/camera.zoom - map.height + 10) {
		camera.y -= 10;
	}
	
	if(e.keyCode == 107 && camera.zoom < 2) {
		camera.zoom *= 1.25;
	}
	
	if(e.keyCode == 109 && camera.zoom > 0.5) {
		camera.zoom /= 1.25;
	}
});

PIXI.loader
	.add("map", "Assets/map.jpg")
	.load(setup);

function setup() {
	map = new PIXI.Sprite(PIXI.loader.resources.map.texture);
	stage.addChild(map);
	render();
}

function render() {
	// Animations
	
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

