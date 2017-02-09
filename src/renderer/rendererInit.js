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
	.add("menu", "./assets/splash.png")
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
	.add("forest", "./assets/forest.png")
	.add("plain", "./assets/Plain.png")
	.add("mountain", "./assets/Mountains.png")
	.add("fog", "./assets/fog.png")
	.add("base", "./assets/base.png")
	// .add("sword", "./assets/swordsman.png")
	.add("swordsman1", "./assets/swordsman_player1.png")
	.add("swordsman2", "./assets/swordsman_player2.png")
	.add("wizard1", "./assets/wizard_player_1.png")
	.add("wizard2", "./assets/wizard_player_2.png")
	.add("scout1", "./assets/cavalry player 1.png")
	.add("scout2", "./assets/cavalry player 2.png")
	.add("king1", "./assets/king player 1.png")
	.add("king2", "./assets/king player 2.png")
	.add("kingFlag1", "./assets/king_with flag_player1.png")
	.add("kingFlag2", "./assets/king_with flag_player2.png")
	// .add("attack", "./assets/attack.png")
	// .add("magician", "./assets/magician.png")
	// .add("scout", "./assets/scout.png")
	.add("king", "./assets/king.png")
	.add("tower1", "./assets/tower_player1.png")
	.add("tower2", "./assets/tower_player2.png")
	.add("flag1", "./assets/flag_p1.png")
	.add("flag2", "./assets/flag_p2.png")
	.add("fireBall1", "./assets/ball_p1.png")
	.add("fireBall2", "./assets/ball_p2.png")
	.add("hp", "./assets/hp.jpg")
	.add("border", "./assets/border.png")
	.add("captureP1", "./assets/capture_p1.jpg")
	.add("captureP2", "./assets/capture_p2.jpg")
	.load(setup);
