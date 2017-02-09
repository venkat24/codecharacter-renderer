const PIXI = require('pixi.js');

var requestAnimationFrame = window.requestAnimationFrame;

var width = window.innerWidth,
	height = window.innerHeight;

var stage = new PIXI.Container(),
	screen = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(width, height);

var webFrame = require('electron').webFrame;
webFrame.setVisualZoomLevelLimits(1, 1);
document.body.appendChild(renderer.view);

var canvas = document.getElementsByTagName('canvas')[0];
canvas.addEventListener("wheel", function(e) {
	if (rendererState == 3) {
		scroll = true;
		if (zoom.val < 2 && e.deltaY < 0)
			zoom.val *= 1.25;
		if (camera.zoom * zoom.init/width >= 1 && e.deltaY > 0)
			zoom.val /= 1.25;
	}
});

PIXI.loader
	.add("menu", "./assets/menu.jpg")
	// **THE FOLLOWING TEXTURES ARE PART OF THE TEST STORY TO BE REMOVED LATER.**
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
	// .add("sword", "./assets/swordsman.png")
	.add("swordsman1", "./assets/swordsman_player1.png")
	.add("swordsman2", "./assets/swordsman_player2.png")
	.add("wizard1", "./assets/wizard_player_1.png")
	.add("wizard2", "./assets/wizard_player_2.png")
	.add("scout1", "./assets/cavalry player 1.png")
	.add("scout2", "./assets/cavalry player 2.png")
	// .add("attack", "./assets/attack.png")
	// .add("magician", "./assets/magician.png")
	// .add("scout", "./assets/scout.png")
	.add("king", "./assets/king.png")
	.add("tower0", "./assets/tower0.png")
	.add("tower1", "./assets/tower1.png")
	.add("tower2", "./assets/tower2.png")
	.add("flag1", "./assets/flag1.png")
	.add("flag2", "./assets/flag2.png")
	.add("fireBall", "./assets/fireBall.png")
	.add("hp", "./assets/hp.jpg")
	.add("border", "./assets/border.png")
	.add("captureP1", "./assets/capture_p1.jpg")
	.add("captureP2", "./assets/capture_p2.jpg")
	.add("running", "./assets/running.png") // FOR TESTING ONLY. There will be no 'running' asset in the final version.
	.load(setup);
