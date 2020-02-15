module.exports = {

  runshareserver: function (bindaddr, bindport, dir) {
    const bodyParser = require('body-parser');
    const express = require('express');
    const path = require('path');
    const fs = require('fs');
    const app = express();

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // set the view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', path.join('./services/views'));
    app.use('/public', express.static(__dirname + '/public'));
    app.use('/share', express.static(__dirname + '/share'));

    var addr = bindaddr;
    var port = bindport;

    app.listen(port, () => {
        console.log(`Binary share running → ${addr}:${port}`);
    });

    app.get('/', (req, res) => {
        // Grab all the files in a directory
        const directoryPath = path.join(__dirname, 'Documents');
        var files;
        fs.readdir(directoryPath, function (err, files) {
            if (err) {
                return console.log('Unable to scan files: ' + err);
            }
        });

        //Send the file list to the rendering
        res.render('share',{title:'Fileshare', files:files, error:''});
    });

  },

  rundashserver: function (bindaddr, bindport, username, password) {

    const bodyParser = require('body-parser');
    const express = require('express');
    const path = require('path');
    const app = express();

    app.use(bodyParser.urlencoded({
        extended: false
    }));

    // set the view engine to ejs
    app.set('view engine', 'ejs');
    app.set('views', path.join('./services/views'));
    app.use('/public', express.static(__dirname + '/public'));

    const addr = bindaddr;
    const port = bindport;

    // set the app to listen on the port
    app.listen(port, () => {
        console.log(`Admin Dashboard at → ${addr}:${port}\n`);
    });

    app.get('/', (req, res) => {
        res.render('login',{title:'Admin Dashboard: Login', error:''});
    });

    app.post('/', (req, res) => {
        if(!req.body.username || !req.body.password){
            res.render('login',{title:'Admin Dashboard: Login', error:'Bad Login'});
        } else {
            if(req.body.username == username && req.body.password == password){
                res.render('admin',{title:'Admin Dashboard: Cyber', error:''});
            }
            //Bad auth
            res.redirect('/');
        }
    });
  }
};
