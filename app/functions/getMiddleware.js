/**
 * Must be registered after getMIddlewares
 * @global
 * @param {string} name of the middleware.
 * @return {function} the middleware with the given name.
 */
module.exports = getMiddleware = (name)=>{
  
   return getMiddlewares().find(middleware=>{
     return middleware.name === name;
   })
 }
 