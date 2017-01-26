var protobuf = require('protobufjs');
var spawn = require('child_process').spawn;
var child = spawn('./ipc');

child.stdout.on('data', (data) => {
	protobuf.load("state.proto", function(err, root) {

		a = root.lookup("IPC.State");
		decoded = a.decode(data);
		for(var actor of decoded.actors)
			for(var id in actor)
				actor[id]=actor[id].toString();
		console.log(decoded.actors);
	});
});
child.on('close', (code) => console.log('Exit code: ' + code));