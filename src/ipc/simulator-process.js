var protobuf = require("protobufjs");

module.exports = {
    /**
     * Executes the start script/command and reads from stdout of the child process
     * @param startCommand specifies the start script/command
     */
    startSimulator : function (startCommand) {
        var childProcess = require('child_process');
        var simulatorProcess = childProcess.exec(startCommand, function (error, stdout, stderr) {
            if(error){
                console.log(error.stack);
                console.log('Error code: '+error.code);
                console.log('Signal received: '+error.signal);
            }
            console.log(stdout);
            // Call Protocol Buffer logic here
        });
        simulatorProcess.on('exit', function (code) {
            console.log('Child process exited with exit code '+code); 
        });
    }
}
