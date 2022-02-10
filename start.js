const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync, execSync } = require('child_process');
const children = [];

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    console.log('killing', children.length, 'child processes');
    children.forEach(function(child) {
      console.log("killing ", child.pid," child process");
      child.kill();
    });
});

if(!fs.existsSync("src/js/vars.ts"))
{
  let hostname = os.hostname().toLocaleLowerCase();
  if(os.hostname().toLocaleLowerCase() != "azrweunodejs01")
  {
    hostname = "localhost";

  }
  console.warn("⚠️src/vars.ts does not exist. Creating with "+hostname+" as backend⚠️");
  let file = 'export const SERVERADDR = "https://'+hostname+':5000/";'
  fs.writeFileSync("src/js/vars.ts", file, {encoding: "utf-8"});
  throw "PLEASE RESTART APPLICATION";
}

//Check if windows or linux
if (os.platform() === 'win32') {


    console.log("Checking if python modules are installed... ");
    execSync("pip install fillpdf");
    //run npm run start:windows and redirect output to console
    const npm = spawn('npm', ['run', 'start:windows'],
    {
      shell: true
    });
    children.push(npm);

    npm.on("spawn", () => console.log("started on windows"));
    
    npm.stdout.setEncoding("utf8");
    npm.stdout.on("data", (data) => console.log(data.toString()));
    npm.stdout.on("error", (data) => console.error(data.toString()));
    npm.on('exit', code => console.log('child process exited with code ' + code.toString()));
}
else if(os.platform() == "linux") {

    spawnSync("chmod", ["+x", "./copy.sh"]);

    const npm = spawn('npm', ['run', 'start:linux']);
    children.push(npm);

    npm.on("spawn", () => console.log("started on linux"));
    npm.stdout.setEncoding("utf8");
    npm.stdout.on("data", (data) => console.log(data.toString()));
    npm.stdout.on("error", (data) => console.error(data.toString()));

    npm.on('exit', code => console.log('child process exited with code ' + code));
}