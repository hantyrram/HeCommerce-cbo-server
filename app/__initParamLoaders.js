const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
let apiParamLoadersFilenames = fs.readdirSync(path.resolve(__dirname,'apis_param_loaders'));

module.exports = function(app){
   console.log(chalk.yellow(`${new Date} : [APP INIT] Initializing api param loaders...`));
   for(let paramLoaderFilename of apiParamLoadersFilenames){
      let paramLoader = require(path.resolve(__dirname,`apis_param_loaders/${paramLoaderFilename}`));
      app.param(paramLoader.params,paramLoader.callback);
   }
}