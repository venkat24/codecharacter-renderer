function render() {
	// Initial variable update before each frame is rendered
	init();

	// Dynamic Resizing
	if (renderer.width != width || renderer.height != height) {
		renderer.resize(width, height);
		document.body.appendChild(renderer.view);
	}


	if (rendererState == 1) {
		menu.width = width;
		menu.height = height;
		stage.setTransform(0, 0, 1, 1);
	}

	if(rendererState == 3) {
		// Console Update
		consoleUpdate();

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

function consoleUpdate() {
	if (messages.toString() !== "") {
		for (var i = 0; i < messages.length; i++) {
			consoleMessages.innerHTML += "<li>" + messages[i] + "</li>";
		}
		messages = [];
		while (consoleMessages.childElementCount > 75) {
			consoleMessages.removeChild(consoleMessages.childNodes[0]);
		}
	}
}

function init() {
	width = window.innerWidth;
	height = window.innerHeight;
	terrainVisibility = visibilityArray[losState];

	if (rendererState == 3) {
		map.x = grid[0][0].x;
		map.y = grid[0][0].y;

		for (var i = 0; i < actors.length; i++) {
			findCenter(actors[i], actorSprites[i]);
		}
		for (var i = 0; i < towers.length; i++) {
			findCenter(towers[i], towerSprites[i]);
		}
		for (var i = 0; i < fireBalls.length; i++) {
			findCenter(fireBalls[i], fireBallSprites[i]);
		}
	}
}

function findCenter(object, sprite) {
	if (object && sprite) {
		object.center.x = object.x + sprite.width/2;
		object.center.y = object.y + sprite.height/2;
	}
}

function update() {
	var change = {
		x: -(1 - 1 / camera.zoom) * width / 2,
		y: -(1 - 1 / camera.zoom) * height / 2
	};

	for (var i = 0; i < grid.length; i++) {
		for (var j = 0; j < grid[i].length; j++) {
			grid[i][j].setTransform(change.x + gridSize * i, change.y + gridSize * j, gridSize/256, gridSize/256);
			fog[i][j].setTransform(change.x + gridSize * i, change.y + gridSize * j, gridSize/256, gridSize/256);
			if (!terrainVisibility[i][j]) {
				grid[i][j].visible = false;
				fog[i][j].visible = false;
			}
			else {
				grid[i][j].visible = true;
				if (terrainVisibility[i][j] == 1) {
					fog[i][j].visible = true;
				}
				else fog[i][j].visible = false;
			}
		}
	}
	for (var i = 0; i < actorSprites.length; i++) {
		if (actors[i]) {
			actorSprites[i].setTransform(actors[i].x + change.x, actors[i].y + change.y);

			if (actors[i].actorType != 5 || actors[i].playerId == losState - 1 || losState === 0) {
				if (visibility(actors[i]) == 2)
					actorSprites[i].visible = true;
				else actorSprites[i].visible = false;
			} else {
				if (actors[i].isVisibleToEnemy)
					actorSprites[i].visible = true;
				else actorSprites[i].visible = false;
			}
		}
	}
	for (var i = 0; i < actorHP.length; i++) {
		if (actors[i]) {
			var health = actors[i].hp / actors[i].maxHp;
			actorHP[i].setTransform(actors[i].x + change.x - 5, actors[i].y + change.y - 12, health, 1);
			if (!actorSprites[i].visible)
				actorHP[i].visible = false;
			else actorHP[i].visible = true;
		}
	}
	for (var i = 0; i < towerSprites.length; i++) {
		if (towers[i]) {
			towerSprites[i].setTransform(towers[i].x + change.x, towers[i].y + change.y);

			var towerVisibility = visibility(towers[i]);
			var id;
			if (towerVisibility == 2) {
				id = towers[i].playerId;
				towers[i].lastSeenID = id;
				towerSprites[i].visible = true;
			}
			else {
				id = towers[i].lastSeenID;
				if (towerVisibility == 1)
					towerSprites[i].visible = true;
				else towerSprites[i].visible = false;
			}

			if (towers[i].currentID != id) {
				towers[i].currentID = towers[i].playerId;
				if (towers[i].playerId === 0)
					towerSprites[i].texture = PIXI.loader.resources.tower1.texture;
				else if (towers[i].playerId == 1)
					towerSprites[i].texture = PIXI.loader.resources.tower2.texture;
				else towerSprites[i].texture = PIXI.loader.resources.tower0.texture;
			}
		}
	}
	for (var i = 0; i < towerHP.length; i++) {
		if (towers[i]) {
			var health = towers[i].hp / towers[i].maxHp;
			towerHP[i].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 12, health, 1);
			if (visibility(towers[i]) == 2)
				towerHP[i].visible = true;
			else towerHP[i].visible = false;
		}
	}
	for (var i = 0; i < flagSprites.length; i++) {
		if (flags[i])
			flagSprites[i].setTransform(flags[i].x + change.x, flags[i].y + change.y);
	}
	for (var i = 0; i < fireBallSprites.length; i++) {
		if (fireBalls[i]) {
			fireBallSprites[i].setTransform(fireBalls[i].x + change.x, fireBalls[i].y + change.y, 1, 1, fireBalls[i].rotation);
			if (visibility(fireBalls[i]) == 2)
				fireBallSprites[i].visible = true;
			else fireBallSprites[i].visible = false;
		}
	}
	for (var i = 0; i < baseSprites.length; i++) {
		if (bases[i])
			baseSprites[i].setTransform(bases[i].x + change.x - 102, bases[i].y + change.y - 102);
	}

	// FOR TESTING ONLY
	if(spriteSheet)
		spriteSheet.setTransform(animatedSprite.x + change.x, animatedSprite.y + change.y, 1.25, 1.25);
}

function visibility(object) {
	if (object.center.x) {
		var x = Math.floor(object.center.x / gridSize),
			y = Math.floor(object.center.y / gridSize);
	} else {
		var x = Math.floor(object.x / gridSize),
			y = Math.floor(object.y / gridSize);
	}

	if (terrainVisibility[x]) {
		if (terrainVisibility[x][y])
			return terrainVisibility[x][y];
		else return 0;
	}
	else return 0;
}
