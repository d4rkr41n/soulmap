const fs = require('fs');
var glob = require("glob");
var path = require('path');
const colors = require('colors');
const config = require('./config.json');

// Yes, this is obnoxious¯\_(ツ)_/¯
const emotes = {'ck':colors.green('[✔ ]'),'x':colors.red('[x]')}
console.log(colors.cyan(config.about.logo.join('\n')));

// ------------- Dynamic importing of modules -----------------
console.log(colors.magenta("--Importing Modules--"));

var basePath = "./modules/";
var mods = glob.sync(path.join(basePath + '*.js')).reduce(function (loaded, file) {
// This allows module exports to be access from the modules dir by just mods.FUNC;
// Kind of just voodoo :)
  var filename = path.basename(file, path.extname(file));
  var mod = require('./' + file);

  process.stdout.write(colors.yellow(`Importing ${filename}`));

  Object.keys(mod).forEach(function (property) {
    loaded[property] = mod[property];
  });

  process.stdout.write(colors.yellow(`\r${emotes['ck']} Importing ${filename}\n`));

  return loaded;
}, {});
console.log(colors.magenta("--Modules Imported--\n"));
// --------------- Imports Finished ---------------------------

var main = new Promise(function(resolve, reject){
    // Import webservers
    var webserv = require('./services/webservers.js');

    // Start the webservers - just ignore the fact that it goes off-screen ;)
    webserv.runshareserver(config.servercfg.share.bindaddr, config.servercfg.share.bindport,config.servercfg.share.sharedir);
    webserv.rundashserver(config.servercfg.dashboard.bindaddr, config.servercfg.dashboard.bindport,config.servercfg.dashboard.username,config.servercfg.dashboard.password);

    resolve('Success!'); // return promise to allow user input
});

main.then(mods.getInput);

//just playing with the nmap command
//scanner.runscan(config.attackcfg.targets);
