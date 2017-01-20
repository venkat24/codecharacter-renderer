function render() {
	// Initial variable update before each frame is rendered
	init();

	// Dynamic Resizing
	if (renderer.width != width || renderer.height != height) {
		renderer.resize(width, height);
		document.body.appendChild(renderer.view);
	}

	if (state == 1) {
		menu.width = width;
		menu.height = height;
		stage.setTransform(0, 0, 1, 1);
	}

	if(state == 3) {
		// For animation testing purposes
		test();

		// Panning and Zooming Functionality
		screenPosition();
		screenZoom();
		stage.setTransform(camera.zoom * camera.x, camera.zoom * camera.y, camera.zoom, camera.zoom);

		// Object Position Update
		update();
	}

	renderer.render(stage);
	requestAnimationFrame(render);
}

function init() {
	width = window.innerWidth;
	height = window.innerHeight;

	if (state == 3) {
		map.x = grid[0][0].x;
		map.y = grid[0][0].y;

		for (var i = 0; i < actors.length; i++) {
			findCenter(actors[i], actorSprites[i]);
		}
		for (var i = 0; i < towers.length; i++) {
			findCenter(towers[i], towerSprites[i]);
		}
		for (var i = 0; i < arrows.length; i++) {
			findCenter(arrows[i], arrowSprites[i]);
		}
	}
}

function findCenter(object, sprite) {
	object.center.x = object.x + sprite.width/2;
	object.center.y = object.y + sprite.height/2;
}

function test() {
	temp ++;
	for (var i = 0; i < actors.length; i++) {
		if (!actors[i].actorType)
			actors[i].x += 5 * Math.sin(temp/25);
	}
}

function update() {
	var change = {
		x: -(1 - 1 / camera.zoom) * width / 2,
		y: -(1 - 1 / camera.zoom) * height / 2
	};

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j].setTransform(change.x + gridW * i, change.y + gridH * j, 0.8, 0.8);
			fog[i][j].setTransform(change.x + gridW * i, change.y + gridH * j, 0.8, 0.8);
			if (!terrainVisibility[i][j]) {
				grid[i][j].visible = false;
				fog[i][j].visible = false;
			}
			else {
				grid[i][j].visible = true;
				if (terrainVisibility[i][j] == 1)
					fog[i][j].visible = true;
				else fog[i][j].visible = false;
			}
		}
	}
	for (var i = 0; i < actorSprites.length; i++) {
		actorSprites[i].setTransform(actors[i].x + change.x, actors[i].y + change.y);
		if (visibility(actors[i]) == 2)
			actorSprites[i].visible = true;
		else actorSprites[i].visible = false;
	}
	for (var i = 0; i < actorHP.length; i++) {
		var health = actors[i].HP / actors[i].maxHP;
		actorHP[i].setTransform(actors[i].x + change.x - 5, actors[i].y + change.y - 12, health, 1);
		if (!actorSprites[i].visible)
			actorHP[i].visible = false;
		else actorHP[i].visible = true;
	}
	for (var i = 0; i < towerSprites.length; i++) {
		towerSprites[i].setTransform(towers[i].x + change.x, towers[i].y + change.y);

		var towerVisibility = visibility(towers[i]);
		if (towerVisibility == 2) {
			var id = towers[i].playerID;
			towers[i].lastSeenID = id;
			towerSprites[i].visible = true;
		}
		else {
			var id = towers[i].lastSeenID;
			if (towerVisibility == 1)
				towerSprites[i].visible = true;
			else towerSprites[i].visible = false;
		}

		if (towers[i].currentID != id) {
			towers[i].currentID = towers[i].playerID;
			if (towers[i].playerID == 0)
				towerSprites[i].texture = PIXI.loader.resources.tower0.texture;
			else if (towers[i].playerID == 1)
				towerSprites[i].texture = PIXI.loader.resources.tower1.texture;
			else if (towers[i].playerID == 2)
				towerSprites[i].texture = PIXI.loader.resources.tower2.texture;
		}
	}
	for (var i = 0; i < towerHP.length; i++) {
		var health = towers[i].HP / towers[i].maxHP;
		towerHP[i].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 12, health, 1);
		if (visibility(towers[i]) == 2)
			towerHP[i].visible = true;
		else towerHP[i].visible = false;
	}
	for (var i = 0; i < flagSprites.length; i++) {
		flagSprites[i].setTransform(flags[i].x + change.x, flags[i].y + change.y);
	}
	for (var i = 0; i < arrowSprites.length; i++) {
		arrowSprites[i].setTransform(arrows[i].x + change.x, arrows[i].y + change.y, 1, 1, arrows[i].rotation);
		if (visibility(arrows[i]) == 2)
			arrowSprites[i].visible = true;
		else arrowSprites[i].visible = false;
	}
	for (var i = 0; i < baseSprites.length; i++) {
		baseSprites[i].setTransform(bases[i].x + change.x - 102, bases[i].y + change.y - 102);
	}

	// FOR TESTING ONLY
	if(spriteSheet)
		spriteSheet.setTransform(animatedSprite.x + change.x, animatedSprite.y + change.y, 1.25, 1.25);
}

function visibility(object) {
	var x = Math.floor(object.center.x / gridW),
		y = Math.floor(object.center.y / gridH);
	return terrainVisibility[x][y];
}
