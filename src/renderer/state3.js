function loadGame() {
	loadTerrain();
	loadArrows();
	loadActors();
	loadTowers();
	loadFlags();
	loadFog();
	loadHP();
	loadBases();
	animation(); // FOR TESTING ONLY
	setTimeout(fadeIn, 500);
}

function getTerrain() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'M', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'M', 'M', 'M', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'M', 'M', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'M', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
		['F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F', 'F'],
		['P', 'P', 'F', 'F', 'F', 'F', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
		['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P']
	];
}

function getVisiblity1() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		[ 0, 1, 1, 2, 2, 1, 2, 1, 2, 2, 2, 0, 0, 2, 0, 1, 0, 0, 2, 1 ],
		[ 1, 2, 2, 2, 2, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 0, 0, 1, 0, 1 ],
		[ 1, 1, 1, 0, 0, 2, 1, 2, 1, 0, 0, 2, 1, 2, 2, 1, 2, 1, 0, 0 ],
		[ 0, 1, 2, 0, 2, 0, 1, 1, 1, 2, 1, 0, 0, 0, 2, 2, 2, 1, 1, 0 ],
		[ 0, 1, 2, 1, 1, 0, 2, 2, 0, 0, 2, 2, 0, 2, 2, 1, 1, 1, 1, 2 ],
		[ 0, 0, 0, 0, 2, 2, 1, 2, 0, 1, 2, 0, 0, 1, 2, 2, 2, 0, 0, 2 ],
		[ 1, 0, 2, 1, 2, 2, 0, 0, 2, 1, 1, 1, 2, 1, 0, 0, 0, 2, 0, 0 ],
		[ 1, 2, 1, 0, 0, 1, 2, 0, 2, 0, 1, 2, 1, 1, 2, 0, 1, 0, 0, 0 ],
		[ 2, 1, 2, 0, 0, 0, 0, 0, 1, 0, 2, 0, 1, 2, 2, 2, 2, 0, 0, 1 ],
		[ 2, 1, 0, 2, 2, 2, 0, 1, 1, 2, 1, 0, 1, 1, 2, 1, 2, 1, 1, 1 ],
		[ 2, 1, 0, 2, 2, 0, 0, 2, 0, 1, 2, 0, 0, 0, 2, 0, 1, 2, 0, 2 ],
		[ 1, 0, 0, 1, 2, 0, 0, 0, 1, 0, 1, 2, 0, 1, 1, 0, 2, 2, 2, 1 ],
		[ 1, 1, 0, 2, 0, 0, 0, 2, 1, 1, 1, 1, 2, 1, 0, 2, 2, 1, 1, 2 ],
		[ 2, 1, 2, 1, 0, 0, 1, 1, 0, 2, 1, 2, 0, 0, 0, 1, 0, 0, 2, 0 ],
		[ 1, 1, 0, 2, 1, 1, 1, 2, 0, 1, 2, 1, 2, 2, 1, 1, 1, 0, 0, 2 ],
		[ 0, 1, 0, 2, 0, 2, 0, 2, 0, 0, 2, 1, 0, 2, 2, 1, 1, 0, 0, 1 ],
		[ 2, 1, 2, 0, 0, 0, 2, 1, 1, 1, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1 ],
		[ 1, 1, 0, 2, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 2, 0, 0, 1, 1 ],
		[ 2, 2, 2, 1, 1, 0, 1, 1, 2, 0, 2, 1, 0, 1, 1, 0, 1, 0, 2, 2 ],
		[ 0, 0, 1, 2, 2, 2, 0, 0, 2, 2, 1, 1, 2, 1, 2, 0, 2, 2, 0, 1 ]
	];
}

function getVisiblity2() {
	// below example for testing only
	// replace with code that reads from simulator
	return [
		[ 1, 0, 2, 1, 2, 0, 2, 0, 2, 0, 1, 1, 0, 1, 1, 1, 1, 0, 2, 0 ],
		[ 2, 1, 2, 2, 0, 1, 2, 0, 1, 0, 1, 2, 2, 1, 1, 2, 2, 2, 0, 2 ],
		[ 2, 2, 0, 1, 2, 1, 1, 1, 1, 2, 0, 1, 1, 1, 0, 0, 1, 1, 2, 0 ],
		[ 1, 1, 1, 0, 1, 1, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 1, 0, 1, 1 ],
		[ 0, 2, 2, 2, 1, 0, 1, 0, 1, 2, 1, 0, 0, 0, 2, 2, 2, 1, 1, 0 ],
		[ 2, 2, 2, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 1, 2, 2, 2, 2, 2, 1 ],
		[ 0, 2, 2, 1, 2, 2, 1, 2, 0, 2, 1, 2, 1, 0, 0, 2, 0, 1, 1, 1 ],
		[ 2, 2, 2, 1, 0, 1, 2, 0, 0, 0, 1, 0, 2, 2, 0, 2, 2, 0, 1, 2 ],
		[ 1, 2, 0, 2, 1, 2, 0, 0, 2, 0, 1, 2, 1, 1, 0, 2, 1, 0, 0, 1 ],
		[ 2, 2, 2, 2, 1, 1, 0, 0, 0, 1, 1, 2, 1, 2, 0, 2, 2, 2, 0, 2 ],
		[ 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 2, 1, 0, 0, 2, 0, 2, 1, 2, 1 ],
		[ 1, 0, 1, 2, 2, 2, 0, 1, 0, 2, 2, 1, 1, 0, 2, 1, 1, 1, 2, 2 ],
		[ 1, 0, 1, 0, 2, 2, 1, 1, 0, 1, 0, 1, 2, 1, 0, 0, 2, 0, 0, 1 ],
		[ 2, 2, 2, 2, 0, 1, 2, 0, 0, 2, 2, 2, 1, 0, 2, 2, 0, 2, 1, 1 ],
		[ 2, 1, 1, 1, 0, 0, 1, 2, 0, 2, 1, 2, 0, 2, 1, 0, 1, 2, 1, 2 ],
		[ 2, 2, 0, 0, 1, 0, 0, 1, 1, 2, 1, 1, 0, 0, 1, 0, 2, 1, 2, 2 ],
		[ 2, 1, 2, 1, 2, 1, 2, 0, 1, 1, 1, 0, 2, 0, 2, 2, 2, 0, 2, 1 ],
		[ 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 2, 2, 0, 2, 1, 1, 2, 0 ],
		[ 1, 1, 1, 2, 1, 1, 1, 2, 2, 0, 2, 0, 1, 1, 2, 2, 2, 2, 0, 1 ],
		[ 0, 2, 2, 0, 1, 1, 2, 2, 1, 2, 1, 0, 1, 1, 2, 1, 1, 0, 2, 1 ]
	];
}

function getVisiblityAll() {
	var arr = [];
	for (var i = 0; i < 20; i++) {
		arr[i] = [];
		for (var j = 0; j < 20; j++) {
			arr[i][j] = 2;
		}
	}

	return arr;
}

function loadTerrain() {
	terrainVisibility = visibilityArray[1];

	for (var i = 0; i < terrain.length; i++) {
		grid[i] = [];
		for (var j = 0; j < terrain[i].length; j++) {
			if (terrain[i][j] === 'P')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.plain.texture);
			else if (terrain[i][j] === 'M')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.mountain.texture);
			else if (terrain[i][j] === 'F')
				grid[i][j] = new PIXI.Sprite(PIXI.loader.resources.forest.texture);

			grid[i][j].setTransform(gridW * i, gridH * j, 0.8, 0.8);
			stage.addChild(grid[i][j]);
		}
	}

	map = {
		width: gridW * grid[0].length,
		height: gridH * grid.length
	};
	zoom.init = map.width;
}

function loadFog() {
	for (var i = 0; i < terrain.length; i++) {
		fog[i] = [];
		for (var j = 0; j < terrain[i].length; j++) {
			fog[i][j] = new PIXI.Sprite(PIXI.loader.resources.fog.texture);
			fog[i][j].setTransform(gridW * i, gridH * j, 0.8, 0.8);
			stage.addChild(fog[i][j]);
		}
	}
}

function loadActors() {
	for (var i = 0; i < actors.length; i++) {
		if (actors[i].actorType == 'sword') {
			if (!actors[i].attack)
				actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.sword.texture);
			else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.attack.texture);
		}
		// else if (actors[i].actorType == 'archer')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.archer.texture);
		// else if (actors[i].actorType == 'cavalry')
		// 	actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.cavalry.texture);
		else if (actors[i].actorType == 'king')
			actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.king.texture);
		else actorSprites[i] = new PIXI.Sprite(PIXI.loader.resources.actor.texture); //FOR TESTING

		actors[i].center = {};
		actorSprites[i].setTransform(actors[i].x, actors[i].y);
		stage.addChild(actorSprites[i]);
	}
}

function loadTowers() {
	for (var i = 0; i < towers.length; i++) {
		if (towers[i].playerID == 0)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower0.texture);
		else if (towers[i].playerID == 1)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower1.texture);
		else if (towers[i].playerID == 2)
			towerSprites[i] = new PIXI.Sprite(PIXI.loader.resources.tower2.texture);

		towers[i].center = {};
		towers[i].currentID = towers[i].playerID;
		towers[i].lastSeenID = towers[i].playerID;
		towerSprites[i].setTransform(towers[i].x, towers[i].y);
		stage.addChild(towerSprites[i]);
	}
}

function loadHP() {
	for (var i = 0; i < actors.length; i++) {
		var health = actors[i].HP/actors[i].maxHP;
		actorHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		actorHP[i].setTransform(actors[i].x - 5, actors[i].y - 12, health, 1);
		stage.addChild(actorHP[i]);
	}
	for (var i = 0; i < towers.length; i++) {
		var health = towers[i].HP/towers[i].maxHP;
		towerHP[i] = new PIXI.Sprite(PIXI.loader.resources.hp.texture);
		towerHP[i].setTransform(towers[i].x - 5, towers[i].y - 12, health, 1);
		stage.addChild(towerHP[i]);
	}
}

function loadFlags() {
	for (var i = 0; i < flags.length; i++) {
		if (flags[i].playerID == 1)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag1.texture);
		if (flags[i].playerID == 2)
			flagSprites[i] = new PIXI.Sprite(PIXI.loader.resources.flag2.texture);

		flagSprites[i].setTransform(flags[i].x, flags[i].y);
		stage.addChild(flagSprites[i]);
	}
}

function loadArrows() {
	for (var i = 0; i < arrows.length; i++) {
		arrowSprites[i] = new PIXI.Sprite(PIXI.loader.resources.arrow.texture);

		arrows[i].center = {};
		arrowSprites[i].setTransform(arrows[i].x, arrows[i].y, 1, 1, arrows[i].rotation);
		stage.addChild(arrowSprites[i]);
	}
}

function loadBases() {
	for (var i = 0; i < bases.length; i++) {
		baseSprites[i] = new PIXI.Sprite(PIXI.loader.resources.base.texture);

		baseSprites[i].setTransform(bases[i].x - 102, bases[i].y - 102);
		stage.addChild(baseSprites[i]);
	}
}

function animation() {
	var base = PIXI.loader.resources.running.texture;

	var textures = [];
	for (var i = 0; i < 10; i++) {
		var frameTexture = new PIXI.Texture(base);
		frameTexture.frame = new PIXI.Rectangle(32 * i, 0, 17, 24);
		textures[i] = frameTexture;
	}

	spriteSheet = new PIXI.extras.AnimatedSprite(textures);
	spriteSheet.position.set(animatedSprite.x, animatedSprite.y);
	spriteSheet.scale.set(1.25);
	spriteSheet.animationSpeed = 0.35;
	spriteSheet.play();
	stage.addChild(spriteSheet);
}

function fadeIn() {
	fade.style.zIndex = -10;
	fade.style.opacity = 0;

	// TO BE CHANGED AFTER INTEGRATION
	camera.x = 0;
	camera.y = 0;
	camera.zoom = 0.6;
	zoom.val = 0.6;
}

function endGame() {
	while (stage.children.length > 1) {
		n = stage.getChildAt(1);
		stage.removeChild(n);
	}
	setTimeout(fadeIn, 500);
}
