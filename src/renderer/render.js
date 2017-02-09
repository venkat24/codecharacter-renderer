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
			grid[i][j].setTransform(change.x + gridSize * i, change.y + gridSize * j);
			fog[i][j].setTransform(change.x + gridSize * i, change.y + gridSize * j);
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
			if (actors[i].actorType === 0) {
				if (actors[i].isAttacking) {
					var xDiff = actors[i].attackTargetPosition.x - actors[i].x;
					var yDiff = actors[i].attackTargetPosition.y - actors[i].y;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						if (xDiff > 0 && actorSprites[i].state != 'aRight') {
							actorSprites[i].state = 'aRight';
							actorSprites[i].textures = actorTextures[i][2][1];
						} else if (xDiff <= 0 && actorSprites[i].state != 'aLeft'){
							actorSprites[i].state = 'aLeft';
							actorSprites[i].textures = actorTextures[i][2][2];
						}
					} else {
						if (yDiff > 0 && actorSprites[i].state != 'aDown') {
							actorSprites[i].state = 'aDown';
							actorSprites[i].textures = actorTextures[i][2][0];
						} else if (yDiff <= 0 && actorSprites[i].state != 'aUp'){
							actorSprites[i].state = 'aUp';
							actorSprites[i].textures = actorTextures[i][2][3];
						}
					}
				} else if (actors[i].isMoving) {
					var xDiff = actors[i].destination.x - actors[i].x;
					var yDiff = actors[i].destination.y - actors[i].y;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						if (xDiff > 0 && actorSprites[i].state != 'mRight') {
							actorSprites[i].state = 'mRight';
							actorSprites[i].textures = actorTextures[i][1][1];
						} else if (xDiff <= 0 && actorSprites[i].state != 'mLeft'){
							actorSprites[i].state = 'mLeft';
							actorSprites[i].textures = actorTextures[i][1][2];
						}
					} else {
						if (yDiff > 0 && actorSprites[i].state != 'mDown') {
							actorSprites[i].state = 'mDown';
							actorSprites[i].textures = actorTextures[i][1][0];
						} else if (yDiff <= 0 && actorSprites[i].state != 'mUp'){
							actorSprites[i].state = 'mUp';
							actorSprites[i].textures = actorTextures[i][1][3]
						}
					}
				} else if (actorSprites[i].state != 's'){
					actorSprites[i].state = 's';
					if (actorTextures[i][0])
						actorSprites[i].textures = actorTextures[i][0][0];
				}
			}
			else if (actors[i].actorType === 6) {
				if (actors[i].isAttacking) {
					var xDiff = actors[i].attackTargetPosition.x - actors[i].x;
					var yDiff = actors[i].attackTargetPosition.y - actors[i].y;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						if (xDiff > 0 && actorSprites[i].state != 'aRight') {
							actorSprites[i].state = 'aRight';
							actorSprites[i].textures = actorTextures[i][2][1];
						} else if (xDiff <= 0 && actorSprites[i].state != 'aLeft'){
							actorSprites[i].state = 'aLeft';
							actorSprites[i].textures = actorTextures[i][2][0];
						}
					} else {
						if (yDiff > 0 && actorSprites[i].state != 'aDown') {
							actorSprites[i].state = 'aDown';
							actorSprites[i].textures = actorTextures[i][2][2];
						} else if (yDiff <= 0 && actorSprites[i].state != 'aUp'){
							actorSprites[i].state = 'aUp';
							actorSprites[i].textures = actorTextures[i][2][3];
						}
					}
				} else if (actors[i].isMoving) {
					var xDiff = actors[i].destination.x - actors[i].x;
					var yDiff = actors[i].destination.y - actors[i].y;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						if (xDiff > 0 && actorSprites[i].state != 'mRight') {
							actorSprites[i].state = 'mRight';
							actorSprites[i].textures = actorTextures[i][1][1];
						} else if (xDiff <= 0 && actorSprites[i].state != 'mLeft'){
							actorSprites[i].state = 'mLeft';
							actorSprites[i].textures = actorTextures[i][1][0];
						}
					} else {
						if (yDiff > 0 && actorSprites[i].state != 'mDown') {
							actorSprites[i].state = 'mDown';
							actorSprites[i].textures = actorTextures[i][1][2];
						} else if (yDiff <= 0 && actorSprites[i].state != 'mUp'){
							actorSprites[i].state = 'mUp';
							actorSprites[i].textures = actorTextures[i][1][3]
						}
					}
				} else if (actorSprites[i].state != 's'){
					actorSprites[i].state = 's';
					if (actorTextures[i][0])
						actorSprites[i].textures = actorTextures[i][0][0];
				}
			}
			else if (actors[i].actorType === 5) {
				if (actors[i].isMoving) {
					var xDiff = actors[i].destination.x - actors[i].x;
					var yDiff = actors[i].destination.y - actors[i].y;
					if (Math.abs(xDiff) > Math.abs(yDiff)) {
						if (xDiff > 0 && actorSprites[i].state != 'mRight') {
							actorSprites[i].state = 'mRight';
							actorSprites[i].textures = actorTextures[i][1][1];
						} else if (xDiff <= 0 && actorSprites[i].state != 'mLeft'){
							actorSprites[i].state = 'mLeft';
							actorSprites[i].textures = actorTextures[i][1][0];
						}
					} else {
						if (yDiff > 0 && actorSprites[i].state != 'mDown') {
							actorSprites[i].state = 'mDown';
							actorSprites[i].textures = actorTextures[i][1][2];
						} else if (yDiff <= 0 && actorSprites[i].state != 'mUp'){
							actorSprites[i].state = 'mUp';
							actorSprites[i].textures = actorTextures[i][1][3]
						}
					}
				} else if (actorSprites[i].state != 's'){
					actorSprites[i].state = 's';
					if (actorTextures[i][0])
						actorSprites[i].textures = actorTextures[i][0][0];
				}
			}
			else if (actors[i].actorType === 4) {
				if (actors[i].isCarryingFlag) {
					if (actors[i].isMoving) {
						var xDiff = actors[i].destination.x - actors[i].x;
						var yDiff = actors[i].destination.y - actors[i].y;
						if (Math.abs(xDiff) > Math.abs(yDiff)) {
							if (xDiff > 0 && actorSprites[i].state != 'mRight') {
								actorSprites[i].state = 'mRight';
								actorSprites[i].textures = actorTextures[i][4][1];
							} else if (xDiff <= 0 && actorSprites[i].state != 'mLeft'){
								actorSprites[i].state = 'mLeft';
								actorSprites[i].textures = actorTextures[i][4][0];
							}
						} else {
							if (yDiff > 0 && actorSprites[i].state != 'mDown') {
								actorSprites[i].state = 'mDown';
								actorSprites[i].textures = actorTextures[i][4][2];
							} else if (yDiff <= 0 && actorSprites[i].state != 'mUp'){
								actorSprites[i].state = 'mUp';
								actorSprites[i].textures = actorTextures[i][4][3]
							}
						}
					} else if (actorSprites[i].state != 's'){
						actorSprites[i].state = 's';
						if (actorTextures[i][3])
							actorSprites[i].textures = actorTextures[i][0][0];
					}
				} else {
					if (actors[i].isMoving) {
						var xDiff = actors[i].destination.x - actors[i].x;
						var yDiff = actors[i].destination.y - actors[i].y;
						if (Math.abs(xDiff) > Math.abs(yDiff)) {
							if (xDiff > 0 && actorSprites[i].state != 'mRight') {
								actorSprites[i].state = 'mRight';
								actorSprites[i].textures = actorTextures[i][1][1];
							} else if (xDiff <= 0 && actorSprites[i].state != 'mLeft'){
								actorSprites[i].state = 'mLeft';
								actorSprites[i].textures = actorTextures[i][1][0];
							}
						} else {
							if (yDiff > 0 && actorSprites[i].state != 'mDown') {
								actorSprites[i].state = 'mDown';
								actorSprites[i].textures = actorTextures[i][1][2];
							} else if (yDiff <= 0 && actorSprites[i].state != 'mUp'){
								actorSprites[i].state = 'mUp';
								actorSprites[i].textures = actorTextures[i][1][3]
							}
						}
					} else if (actorSprites[i].state != 's'){
						actorSprites[i].state = 's';
						if (actorTextures[i][0])
							actorSprites[i].textures = actorTextures[i][0][0];
					}
				}
			}

			actorSprites[i].setTransform(actors[i].x + change.x, actors[i].y + change.y, 1.2, 1.2);

			if (actors[i].actorType != 5 || actors[i].playerId == losState - 1 || losState === 0) {
				if (visibility(actors[i]) == 2)
					actorSprites[i].visible = true;
				else actorSprites[i].visible = false;
			} else {
				if (actors[i].isVisibleToEnemy)
					actorSprites[i].visible = true;
				else actorSprites[i].visible = false;
			}

			if (actors[i].hp === 0) 
				actorSprites[i].visible = false;
		}
	}
	for (var i = 0; i < actorHP.length; i++) {
		if (actors[i]) {
			var health = actors[i].hp / actors[i].maxHp;
			actorHP[i][0].setTransform(actors[i].x + change.x - 5, actors[i].y + change.y - 12, health, 1);
			actorHP[i][1].setTransform(actors[i].x + change.x - 6, actors[i].y + change.y - 13);
			if (!actorSprites[i].visible) {
				actorHP[i][0].visible = false;
				actorHP[i][1].visible = false;
			}
			else {
				actorHP[i][0].visible = true;
				actorHP[i][1].visible = true;
			}
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

			towerHP[i][0].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 12, health*3, 1);
			towerHP[i][1].setTransform(towers[i].x + change.x - 5, towers[i].y + change.y - 26, scale1*3, 1);
			towerHP[i][2].setTransform(towerHP[i][1].x + towerHP[i][1].width, towerHP[i][1].y, scale2*3, 1);
			towerHP[i][3].setTransform(towerHP[i][1].x + towerHP[i][1].width, towerHP[i][1].y + 3.5);
			towerHP[i][4].setTransform(towers[i].x + change.x - 6, towers[i].y + change.y - 13, 3, 1);

			if (visibility(towers[i]) == 2) {
				towerHP[i][0].visible = true;
				if (health !== 0) {
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
				for (var j = 0; j < 5; j++) {
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
