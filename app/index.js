/**
 * ECommerce Software
 * @module htcommerce
 * @author Ronaldo Ramano
 */
const os = require('os');
const express = require('express');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const SwaggerParser = require("@apidevtools/swagger-parser")
const sessionOnRedis = require('./modules/session-on-redis');
const cookieParser = require('cookie-parser');
const dependencyManager = require('./dependencyManager');
const server = express();
const app = express();
const PORT = process.env.PORT || 8080;

const parser = new SwaggerParser();
// (async function(){
//    const api = await parser.dereference(path.join(__dirname,'defs/api.yaml'));
//    console.dir(api);
// })()

(async function(){
   const api = await parser.dereference(path.join(__dirname,'spec/App.yaml'));
   // console.dir(api,{depth:null});
   console.dir(await parser.validate(path.join(__dirname,'spec/App.yaml')),{depth:null});
   const paths = Object.keys(api.paths);
   console.log('Paths', paths);
})()

const __defineGlobals = require('./__defineGlobals');
__defineGlobals();

global.IMAGES_PRODUCTS_DIR = path.join(__dirname,'../staticdb/images/products');
global.IMAGES_PRODUCTS_PATH = '/cbo/apiv1/images/products';

const __initParamLoaders = require('./__initParamLoaders');
const __initAuthentication = require('./__initAuthentication');
const __defineApis = require('./__defineApis');

const DEPENDENCY_CHECK_RETRIES = 50;

/**
 * 
 * Sets up, the app, call after when dependencyManager.isRead.
 */
function start(app){
   //where using apiv1 only to catch this on proxy_pass on nginx
   //we should make an entry on nginx for /static instead perhaps point to separate static webserver
   app.use('/cbo/apiv1/static',express.static(path.join(__dirname,'../public')));
   app.use('/cbo/apiv1/images/products',express.static(path.join(__dirname,'../staticdb/images/products')));
   app.use(express.json());
   app.use(cookieParser());
   app.use(sessionOnRedis({redisClient:dependencyManager.dependencies.redisClient}));
   app.use((req,res,next)=>{
      //initialize
      //associative array that will be used by param loaders to attach any fetched entity
      req.preLoadedResource = [];
      next();
   });
   
   
   __initParamLoaders(app);
   __initAuthentication(app);
   __defineApis(app);
}

let counter = 0;

let clear = setInterval(function(){
   counter += 1;
   if(dependencyManager.isReady() && counter !== DEPENDENCY_CHECK_RETRIES){
      clearInterval(clear);
      start(app);
   }
},1000);


/**
 * Server Middleware. Check if dependencyManager.isReady.
 */
server.use((req,res,next)=>{
   if(!dependencyManager.isReady()){
      console.log('@app/index:61 Request recieved while dependencies aren\'r ready');
      res.status(200).json({type:'MAINTENANCE_MODE',text:'sorry, site under maintenance please try again later!'});
      return;
   }
   // start(app);
   // console.log(chalk.yellow(`${new Date} : [SERVER START_UP] Dependencies are Ready! Server can now now accept requests!`));
   next();
});

/**
 * Server Middleware. Setup server log.
 */
// server.use((req,res,next)=>{
//    fs.appendFile(path.resolve(__dirname,'logs/server.log'),`${new Date} [CLIENT CONNECTED] : IP=${req.ip} ${os.EOL}`,(err)=>{
//       if(err){
//          console.log(chalk.yellow(`${new Date} : [SERVER LOGGING] Error on Server Log Middleware ${os.EOL}` ));
//       }
//    });
//    next();
// });

/**
 * Use app
 */
server.use(app);

/**
 * Startup server.
 */
server.listen(PORT,function(){
   console.log(`${new Date} : [SERVER START_UP] Server started on port ${PORT}`);
   console.log(`${new Date} : [SERVER START_UP] Server is on "${process.env.NODE_ENV}" mode`);
});










