const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame;

var width = window.innerWidth,
	height = window.innerHeight;

var stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var menu,
	map,
	storyCount = 1,
	storyTransition = false,
	actorSprites = [],
	towerSprites = [],
	flagSprites = [],
	arrowSprites = [],
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

var arrows = [
	{
		id: 1,
		x: 470,
		y: 500,
		rotation: -Math.PI/5
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

var up = false,
	down = false,
	left = false,
	right = false,
	scroll = false,
	zoom = {
		in: false,
		out: false,
		val: 0.6,
		init: 0
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
document.body.addEventListener("mousemove", function(e) {
	if (e.clientX < width * 0.1)
		left = true;
	else left = false;
	if ( !(e.clientX > width - 95 && e.clientX < width - 10 && e.clientY < 330) ) {
		if (e.clientX > width * 0.9)
			right = true;
		else right = false;
		if (e.clientY < height * 0.1)
			up = true;
		else up = false;
	} else {
		right = false;
		up = false;
	}
	if (e.clientY > height * 0.9)
		down = true;
	else down = false;
});
document.body.addEventListener("wheel", function(e) {
	if (state == 3) {
		scroll = true;
		if (zoom.val < 2 && e.deltaY < 0)
			zoom.val *= 1.25;
		if (camera.zoom * zoom.init/width >= 1 && e.deltaY > 0)
			zoom.val /= 1.25;
	}
});
document.body.addEventListener("mousedown", function(e) {
	if (state == 2) {
		if (!storyTransition && e.button === 0) {
			if (storyCount < 14) {
				storyCount++;
				nextImg();
			}
			else startGame();
		} else if (e.button == 2) {
			startGame();
		}
	}
});

PIXI.loader
	.add("menu", "./assets/menu.jpg")
	// **THE FOLLOWING 16 TEXTURES ARE PART OF THE TEST STORY TO BE REMOVED LATER.**
	.add("./assets/story/1.jpg")
	.add("./assets/story/2.jpg")
	.add("./assets/story/3.jpg")
	.add("./assets/story/4.jpg")
	.add("./assets/story/5.jpg")
	.add("./assets/story/6.jpg")
	.add("./assets/story/7.jpg")
	.add("./assets/story/8.jpg")
	.add("./assets/story/9.jpg")
	.add("./assets/story/10.jpg")
	.add("./assets/story/11.jpg")
	.add("./assets/story/12.jpg")
	.add("./assets/story/13.jpg")
	.add("./assets/story/14.jpg")
	// **..**
	.add("forest", "./assets/forest.jpg")
	.add("plain", "./assets/plains.jpg")
	.add("mountain", "./assets/mountain.jpg")
	.add("fog", "./assets/fog.png")
	.add("base", "./assets/base.png")
	.add("actor", "./assets/bunny.png") // FOR TESTING ONLY.
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
