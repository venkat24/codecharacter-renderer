function setup() {
	loadMenu();
	render();
}

function loadMenu() {
	menu = new PIXI.Sprite(PIXI.loader.resources.menu.texture);
	stage.addChild(menu);
}