module.exports = {

  getInput: function () {
    const config = require('../config.json');
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

    var runMode = config.generalcfg.defaultRunMode;
    var readCommand = function(){

      buffer.question(colors.cyan('sm('+runMode+')> '), function (input) {
        var command = input.split(' ')[0];
        var args = input.split(' ');
        args.shift();

        if((!Array.isArray(args) || !args.length) && (command == 'i' || command == 'r')){
          runMode = command;
          readCommand();
        }else{
          switch(runMode){
            case 'i':
              var found = false;
              for(key in cmds){
                if(key == command){
                  cmds[key](args);
                  found = true;
                }
              } if(!found && (command != '' && command != ' ')){console.log(colors.red('< feature not found >'));}
              readCommand();
            break;

            case 'r':
              var exec = require('child_process').exec;
              var stmt = command + ' ' + args.join(' ');

              function os_func() {
                this.execCommand = function (cmd) {
                  return new Promise((resolve, reject)=> {
                    exec(stmt, function(error, stdout, stderr){
                      if (error) {
                        reject(stderr);
                        return;
                      }
                      resolve(stdout)
                    });
                  })
                }
              }

              if(stmt != '' && stmt != ' '){
                var os = new os_func();

                os.execCommand(stmt).then(res=> {
                  console.log(res);
                  readCommand();
                }).catch(err=> {
                  console.log(err);
                  readCommand();
                })
              }
            break;
          }
        }
        //readCommand();
      });
    }
    readCommand();
  }
}
