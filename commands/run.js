module.exports = {
    run: function(args){
      return new Promise(function(resolve, reject) {
        var exec = require('child_process').exec;
        var stmt = args.join(' ');
        if(stmt != '' && stmt != ' '){
          exec(stmt, function(error, stdout, stderr){
            console.log('\n'+stdout);
          });
        }
        resolve('Success!');
      });
    },
    runq: function(args){
      return new Promise(function(resolve, reject) {
        var exec = require('child_process').exec;
        var stmt = args.join(' ');
        if(stmt != '' && stmt != ' '){
          exec(stmt, function(error, stdout, stderr){});
        }
        resolve('Success!');
      });
    }
}