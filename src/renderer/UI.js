
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
}