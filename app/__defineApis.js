const services = require('./services');
const chalk = require('chalk');
const _registry = require('./_registry');
const path = require('path');

module.exports = function(app){

   const middlewares = _registry.middlewares.map(rm => require(rm));
   
   let apis = [];

   //define apis on app
   for(let service of services.filter( service => Boolean(service.api) && Boolean(service.api.path))){
      // console.log(chalk.red(`${new Date} : [APP INIT] ${error.code} Error in Retrieving ${api.serviceProvider} defined in ${filename}. Skipping api definition!`));
      //NOTE: apiVersion must be separated by _ not by . e.g. 1_2 instead of 1.2
      let apiPath = path.join(`/cbo/apiv${service.api.apiVersion || 1}/`,service.api.path);
      console.log(apiPath);
      const reqAttachments = (req,res,next)=>{
         req.currentApi = service.api;//attaches the current api definition handling the request
         next();
      }

      let apiMiddlewares = [];
      if(service.api.use){
         service.api.use.forEach(middlewareName=>{
            let found = middlewares.find(middlewareFunction=> middlewareFunction.name === middlewareName);
            if(found){
               apiMiddlewares.push(found);
            }
      
         });
      }

      if(apiMiddlewares.length > 0){
         app[service.api.method](apiPath,reqAttachments,apiMiddlewares,service);   
         console.log(chalk.green(`${new Date} : [APP INIT] ${service.api.method}:/${apiPath} endpoint added.`));
         continue;
      }

      app[service.api.method](apiPath,reqAttachments,service);
      console.log(chalk.green(`${new Date} : [APP INIT] ${service.api.method}:/${apiPath} endpoint added.`));
   }
}