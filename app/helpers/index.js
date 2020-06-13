const pathToRegexp = require('path-to-regexp');
const path = require('path');
const config = require('../config');


/**
 * Checks if there is a route definition that could handle the current req.method and req.path. This is 
 * useful on middlewares defined before the route handlers.
 * @namespace helpers
 * @type {typedefs~helper}
 * @function getRoute
 * @param {Array} routes - Array of routes.
 * @param {object} req - The request object.
 * @param {typedefs~route} - The found route or null.
 */
module.exports.getRoute = (routes,req) => {
 let regexp;
 let route = routes.find(route=>{
  regexp = pathToRegexp(route.path);
  return route.method.toLowerCase() === req.method.toLowerCase() && regexp.exec(req.path) !== null;
 });
 return route;
}

/**
 * Generates a string of random characters based on a sample.
 * @memberof helpers 
 * @type {typedefs~helper}
 * @function randomStrGenerator
 * @param {number} length - The length of the output string.
 * @param {string} sample - The characters in which the output string will be based on.
 * @param {string} - The generated string from sample.
 */
module.exports.randomStrGenerator =(length,SAMPLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@&^$#-+')=>{
 let arr = [];
 for(let i = 0; i < length; i++){
  let index = Math.floor(Math.random() * SAMPLE.length);
  arr.push(SAMPLE[index]);
 }
 return arr.join("");
}

/**
 * @global
 * @returns {Array} - The array of middlewares as defined on the middlewares config.
 */
module.exports.getMiddlewares = ()=>{
   return config.middlewares.map((middleware)=>{
     return require(path.resolve(process.cwd()+middleware));
   })
 }

/**
 * @global
 * @param {string} name of the middleware.
 * @return {function} the middleware with the given name.
 */
module.exports.getMiddleware = (name)=>{
  
   return getMiddlewares().find(middleware=>{
     return middleware.name === name;
   })
 }
 
 /**
  * @global
  * @returns {Array} - The array of services as defined on the services config
  */
 module.exports.getServices = getServices = () => {
   return config.services.map((pathToService)=>{
     return require(path.resolve(process.cwd() + pathToService));
   })
 } 

 /**
  * @global
  * @param {String} serviceName = The name of the service.
  * @returns {Array} - The service with the given name.
  */
 module.exports.getService = (serviceName) =>{
   return getServices().filter(service => {
      return service.name === serviceName
   })[0];
 }

 /**
  * Forwards/pipes the request to other service provider. This allows piping of request to other services.
  * @param {Object} req - The current request object.
  * @param {Object} next - The next object.
  * @param {Service.referer} referer - The referer of the request, defines where the request originated, and
  * the params needed by the service accepting the request.
  * @param {String} to - The name of the service that the request will be forwarded to.
  * 
  */
 module.exports.forwardRequest = (req,next,referer,to)=>{
   req.app.use(
      (req,res,next)=>{
         req.referer = referer;
         next();
      },
      getService(to)
   )
   next();
 }

 /**
 * @returns {Array} - The array of routes as defined on the routes config
 */
module.exports.getRoutes = ()=>{
   return config.routes;
  }
  
/**
* @returns {Array} - The array of routes as defined on the routes config
*/
module.exports.errorsHandlers = ()=>{
   return config.errorHandlers.map(handler=>{
   return require('../error_handlers/' + handler);
   });
}

/**
 * Converts an express query object, retrieved from the express request object to a
 * mongo query object.
 * @param {Object} query The express request.query object.
 * @return {Object} The mongo query object
 */
module.exports.mongoQuery = (query)=>{
   return JSON.parse(query);
}