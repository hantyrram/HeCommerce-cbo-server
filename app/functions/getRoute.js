
const getRoutes = require('./getRoutes');
const pathToRegexp = require('path-to-regexp');
/**
 * Checks if there is a route definition that could handle the current req.method and req.path. This is 
 * useful on middlewares defined before the route handlers.
 * @namespace helpers
 * @type {typedefs~helper}
 * @function getRoute
 * @param {object} req - The request object.
 * @param {typedefs~route} - The found route or null.
 */
module.exports = getRoute = (req) => {
   let regexp;
   console.log('Req path',req.path);
   
   return getRoutes().find((route,i)=>{
      console.log('Route path',i,route.path);
      regexp = pathToRegexp(route.path);
      return route.method.toLowerCase() === req.method.toLowerCase() && regexp.exec(req.path) !== null;
   })
   
  }