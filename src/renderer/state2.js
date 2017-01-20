function loadStory() {
	fadeIn();
	storyCount = 1;
	story = new PIXI.Sprite(PIXI.loader.resources["./assets/story/1.jpg"].texture);
	stage.addChild(story);
}

function nextImg() {
	fade.style.zIndex = 10;
	fade.style.opacity = 1;
	storyTransition = true;
	setTimeout(function() {
		story.texture = PIXI.loader.resources["./assets/story/" + storyCount + ".jpg"].texture;
		storyTransition = false;
		fade.style.zIndex = -10;
		fade.style.opacity = 0;
	}, 500);
}