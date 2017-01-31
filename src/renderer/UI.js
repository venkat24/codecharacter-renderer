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

var userConsole = document.getElementById('console'),
	consoleMessages = document.getElementById('messages'),
	message;

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
	if (e.ctrlKey) {
		if (e.keyCode == 67) {
			if(userConsole.style.opacity == 0) {
				userConsole.style.zIndex = 75;
				userConsole.style.opacity = 0.6;
			}
			else {
				userConsole.style.opacity = 0;
				setTimeout(function() {userConsole.style.zIndex = -75}, 200);
			}
		}
		if (e.keyCode == 76) {
			userConsole.innerHTML = "<ul id='messages'></ul>";
			consoleMessages = document.getElementById('messages');		}
		if (e.keyCode == 70) {
			if (userConsole.style.width != "100%")
				userConsole.style.width = "100%";
			else userConsole.style.width = "25%";
		}
		if (e.keyCode == 187 || e.keyCode == 189) {
			e.preventDefault();
		}
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
	if(e.deltaY % 1 !== 0) {
		e.preventDefault();
	}
	if (rendererState == 3) {
		scroll = true;
		if (zoom.val < 2 && e.deltaY < 0)
			zoom.val *= 1.25;
		if (camera.zoom * zoom.init/width >= 1 && e.deltaY > 0)
			zoom.val /= 1.25;
	}
});
document.body.addEventListener("mousedown", function(e) {
	if (rendererState == 2) {
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

function screenPosition() {
	if ( !(up && down) ) {
		if (up && camera.vel.y < 16)
			camera.vel.y += 1.6;
		if (down && camera.vel.y > -16)
			camera.vel.y -= 1.6;
	}

	if ( !(left && right) ) {
		if (left && camera.vel.x < 16)
			camera.vel.x += 1.6;
		if (right && camera.vel.x > -16)
			camera.vel.x -= 1.6;
	}

	if (camera.vel.x < 0.01 && camera.vel.x > -0.01)
		camera.vel.x = 0;
	if (camera.vel.y < 0.01 && camera.vel.y > -0.01)
		camera.vel.y = 0;

	camera.vel.x *= 0.85;
	camera.vel.y *= 0.85;

	camera.x += camera.vel.x;
	camera.y += camera.vel.y;

	if (map.x + camera.x > 0) {
		camera.vel.x = 0;
		camera.x = -0.01 - map.x;
	}
	if (map.x + camera.x < width/camera.zoom - map.width) {
		camera.vel.x = 0;
		camera.x = 0.01 + width/camera.zoom - map.width - map.x;
	}
	if (map.y + camera.y > 0) {
		camera.vel.y = 0;
		camera.y = -0.01 - map.y;
	}
	if (map.y + camera.y < height/camera.zoom - map.height) {
		camera.vel.y = 0;
		camera.y = 0.01 + height/camera.zoom - map.height - map.y;
	}
}

function screenZoom() {
	if ( !(zoom.in && zoom.out) ) {
		if (camera.zoom < 2) {
			if (zoom.in && camera.vel.zoom < 0.02)
				camera.vel.zoom += 0.005;
		}
		if (camera.zoom * zoom.init/width >= 1) {
			if (zoom.out && camera.vel.zoom > -0.02)
				camera.vel.zoom -= 0.005;
		}
	}

	if (scroll && Math.abs(camera.zoom - zoom.val) > 0.02) {
		if (camera.zoom < zoom.val && camera.vel.zoom < 0.02)
			camera.vel.zoom += 0.02;
		else if (camera.zoom > zoom.val && camera.vel.zoom > -0.02)
			camera.vel.zoom -= 0.02;
	} else {
		scroll = false;
		zoom.val = camera.zoom;
	}

	if (camera.vel.zoom < 0.001 && camera.vel.zoom > -0.001)
		camera.vel.zoom = 0;

	camera.vel.zoom *= 0.85;
	camera.zoom += camera.vel.zoom;

	if (camera.zoom * zoom.init/width <= 1) {
		camera.zoom = 1 * width/zoom.init;
		zoom.val = camera.zoom;
	}
	if (camera.zoom * zoom.init/height <= 1) {
		camera.zoom = 1 * height/zoom.init;
		zoom.val = camera.zoom;
	}
}