module.exports = {

  nmap: function (hosts, params) {
    const { spawn } = require('child_process');
    const nmap = spawn('nmap', [hosts,'-p22','--open','-oG','-']);

    nmap.stdout.on('data', (data) => {
      console.log(`${data}`);
      return(`${data}`);
    });

    nmap.stderr.on('data', (data) => {
      console.error(`${data}`);
    });

    //nmap.on('close', (code) => {
    //  console.log(`child process exited with code ${code}`);
    //});
  }
}
