var protobuf = require('protobufjs');
var spawn = require('child_process').spawn;
var child = spawn('./ipc');
// var x;

function listen() {
	console.log('listening');
	child.stdout.on('data', (data) => {
		console.log(data);
		// x = data;
		protobuf.load("state.proto", function(err, root) {

			a = root.lookup("IPC.State");
			decoded = a.decode(data);
			for(var actor of decoded.actors)
				for(var id in actor)
					actor[id]=actor[id].toString();
			console.log(decoded.actors);
			// listen();
		});
	});
}

listen();
// child.on('close', (code) => console.log('Exit code: ' + code));