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

		// Score Update
		scoreUpdate();

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

function scoreUpdate() {
	if (stateVariable.scorePlayer1 && stateVariable.scorePlayer2) {
		document.getElementById('score1').innerHTML = stateVariable.scorePlayer1.low;
		document.getElementById('score2').innerHTML = stateVariable.scorePlayer2.low;
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

			if (towers[i].playerId === 0)
				towerSprites[i].texture = PIXI.loader.resources.tower1.texture;
			else if (towers[i].playerId == 1)
				towerSprites[i].texture = PIXI.loader.resources.tower2.texture;

			if (visibility(towers[i]) !== 0)
				towerSprites[i].visible = true;
			else towerSprites[i].visible = false;
		}
	}
	for (var i = 0; i < towerHP.length; i++) {
		if (towers[i]) {
			var health = towers[i].hp / towers[i].maxHp;
			var captureScore = towers[i].contentionMeterScore;
			if (captureScore > 0) {
				var scale2 = captureScore/100;
				var scale1 = 2 - scale2;
			} else if (captureScore < 0) {
				var scale1 = Math.abs(captureScore/100);
				var scale2 = 2 - scale1;
			} else {
				var scale1 = 1;
				var scale2 = 1;
			}

			towerHP[i][0].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 12, health, 1);
			towerHP[i][1].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 20, scale1, 1);
			towerHP[i][2].setTransform(towerHP[i][1].x + towerHP[i][1].width, towerHP[i][1].y, scale2, 1);
			towerHP[i][3].setTransform(towerHP[i][1].x + towerHP[i][1].width, towerHP[i][1].y + 3.5);

			if (visibility(towers[i]) == 2) {
				if (health !== 0) {
					towerHP[i][0].visible = true;
					for (var j = 1; j < 4; j++) {
						towerHP[i][j].visible = false;
					}
				} else {
					towerHP[i][0].visible = false;
					for (var j = 1; j < 4; j++) {
						towerHP[i][j].visible = true;
					}
				}
			} else {
				for (var j = 0; j < 4; j++) {
					towerHP[i][j].visible = false
				}
			}
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
