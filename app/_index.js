/**
 * ECommerce Software
 * @module htcommerce
 * @author Ronaldo Ramano
 */
require('dotenv').config();
const path = require('path');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cookieParser = require('cookie-parser');
const express = require('express');
const dependencyManager = require('./dependencyManager');
const sessionOnRedis = require('../local_modules/session-on-redis');
const authentication = require('../local_modules/authentication');
//Policy Based Authorization
const authorization = require('../local_modules/authorization');
const {serviceUsePolicy} = require('./policies');
require('./_globals');

let serverStarted = false;

/**
 * Loads the route definitions on the express app, using the serviceProvider as responder.
 * Loads the middlewares specific to the routes as well.
 * If a route does not have the 'method' key, default value is 'get'.
 * @param {object} app - The express app
 * @param {Array} routes - Array of routes
 * @param {Array} services - Array of services
 */
const init = (app)=>{
 
 app.set('db',dependencyManager.dependencies.db);
 app.use(express.static(process.cwd()+'/tempimages'));//just to serve the favicon temporarily
 app.use(express.json());
 app.use(cookieParser());
 app.use(sessionOnRedis({redisClient:dependencyManager.dependencies.redisClient}));

 app.use(getMiddleware('handleNonXHR'));
 app.use(getMiddleware('attachArtifactToResponse'))
 app.use(getMiddleware('attachCurrentServiceToReq'));
 
 authentication.serializeUser(function(user,done){
  done(user._id);//save the _id only to the session
 });

 authentication.deserializeUser(function(id,done){
  let OPTIONS = {
   projection:{"credential.password":0}
  };

  app.get('db').collection('employees').findOne(ObjectID(id),OPTIONS,function(err,employee){
    const { _id, empID, fname, lname, roles, credential  } = employee;
    let user = { _id, empID, fname, lname, roles, credential: { username: credential.username} };
    done(user);
  });
 });

 authorization.deserializeUserRoles(function(currentLoggedInUser,done){
  if(!currentLoggedInUser){
   let roles = [];
   done(roles);
   return;
  }

  if(currentLoggedInUser.roles !== undefined && currentLoggedInUser.roles.length !== 0){
   //query roles with role names = the current user's roles e.g. ['admin','product_manager']
   let QUERY = {
    $or : currentLoggedInUser.roles.map(roleName=>{return {name:roleName}})
   }
   app.get('db').collection('roles')
   .find(QUERY)
   .toArray(function(error,roles){
    
    done(roles);
   });
  }
 });

if(process.env.NODE_ENV === 'development'){
   if(process.env.DEV_AUTHENTICATION === 'enabled'){
      ////turn on authentication module during development if DEV_AUTHENTICATION is set
      app.use(authentication.init({ Artifact: global.Artifact, loginURL:`/${config.API_VERSION}/login` })); 
   }else{
      app.use((req,res,next)=>{
         //attach a dummy user on development mode.
         req.user = {
            userAccount :{
               credential: {
                  username: 'devuser_testuser'
               }
            }
         }
         next();
      });
   }  

   //turn on authorization module during development
   if(process.env.DEV_AUTHORIZATION === 'enabled'){
      //enabled authentication on development
      app.use(authorization([serviceUsePolicy]));
   }
}else{
   //use authentication and authorization by default
    app.use(authentication.init({ Artifact: global.Artifact, loginURL:`/${config.API_VERSION}/login` })); 
    app.use(authorization([serviceUsePolicy]));
}
  
 const DEFAULT_REQUEST_METHOD = 'get';

 let routes = getRoutes();
 for(let i = 0; i < routes.length; i++){
  let route = routes[i];
  let serviceProvider = getServices().find(service=>route.serviceProvider === service.name);
  if(serviceProvider){  //only define routes that has an existing service provider
   //get middlewares
   let routeSpecificMiddlewares;
   if(route.middlewares && route.middlewares.length > 0){

    //get middlewares that are defined on each route if there is any.
    let middlewaresDefinedOnRoute = middleware => route.middlewares.includes(middleware.name);
    //Reducer that'll sort the filtered routes based on how the route.middlewares are defined.Since sequence is important.
    let sortBasedOnRouteMiddlewaresDefinition = (acc,middleware) => {
     acc[route.middlewares.indexOf(middleware.name)] = middleware;
     return acc;
    };

    routeSpecificMiddlewares = getMiddlewares().filter(middlewaresDefinedOnRoute);
    routeSpecificMiddlewares = routeSpecificMiddlewares.length > 0 ? routeSpecificMiddlewares.reduce(sortBasedOnRouteMiddlewaresDefinition) : routeSpecificMiddlewares;

   }
   if(routeSpecificMiddlewares){
    app[route.method || DEFAULT_REQUEST_METHOD](route.path,routeSpecificMiddlewares,serviceProvider);
    continue;
   }
   app[route.method || DEFAULT_REQUEST_METHOD](route.path,serviceProvider);
  }
  
 }
//  console.log(app._router.stack);
 app.use(errorsHandlers());

}

/**
 * Start the server. Mount apps here.
 * @param {object} server 
 */
const server = express();

/**
 * The hantyr ecommerce app.
 */
const app = express();

server.use((req,res,next)=>{
 if(dependencyManager.isReady()){
  console.log('Dependencies Ready');
  init(app);
  next();
  return;
 }
 let error = new Artifact.Error('UNDER_MAINTENANCE','Sorry! Site is under maintenance. Please try Again Later');
 let artifact = new Artifact('nok','m_main',error);
 res.send(artifact);
});

server.use(app);

server.listen(process.env.PORT || 1234,function(){
 serverStarted = true;
 console.log('Server Started: ',serverStarted);
});






