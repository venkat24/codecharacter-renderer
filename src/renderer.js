files = [ 'UI', 'render', 'state3', 'state2', 'state1', 'rendererInit' ];

for (var i = 0; i < files.length; i++) {
	var js = document.createElement("script");
	js.src = `./renderer/${files[i]}.js`;
	js.async = false;
	document.body.appendChild(js);
}
