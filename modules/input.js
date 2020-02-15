module.exports = {

  getInput: function () {
    const colors = require('colors');
    var glob = require("glob");
    var path = require('path');

    //Set up the buffers
	const readline = require("readline");
	const buffer = readline.createInterface({
    		input: process.stdin,
    		output: process.stdout
	});

    var basePath = "./commands/";
    var cmds = glob.sync(path.join(basePath + '*.js')).reduce(function (loaded, file) {
        // This allows command exports to be access from the commands dir by just cmds.FUNC;
        // Kind of just voodoo :)
        var cmd = require('../' + file);

        Object.keys(cmd).forEach(function (property) {
          loaded[property] = cmd[property];
        });
        return loaded;
    }, {});

    var readCommand = function(){
        buffer.question(colors.cyan('sm(i)> '), function (input) {
          var command = input.split(' ')[0];
          var args = input.split(' ');
          args.shift(); //Remove the command

          var found = false;
          for(key in cmds){
            if(key == command){
                cmds[key](args);
                found = true;
            }
          } if(!found && (command != '' && command != ' ')){console.log(colors.red('< feature not found >'));}
          readCommand();
      });
    };
    readCommand();
  }
}
