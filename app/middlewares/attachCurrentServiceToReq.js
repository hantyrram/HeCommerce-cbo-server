
const config = require('../config');
const pathToRegexp = require('path-to-regexp');
const Artifact = require('../Artifact');
const {getRoute} = require('../helpers');
/**
 *
 * @function attachCurrentServiceToReq
 * @memberof middlewares
 * @type {typedefs~middleware}
 * @desc Attaches the @see {@link{typedefs~service}} and the route that's being accessed, to the request object. 
 * Authorization module and validateSchema middleware depends on this. 
 * The service will ba attached as Request.currentAccessedService property.
 * The route will be attached as Request.currentRoute property.
 */
module.exports = attachCurrentServiceToReq = (req,res,next)=>{
   console.log(`m_attachCurrentService: `,new Date());
  let route = getRoute(config.routes,req);
  //attache the service 
  if(!route){
    next({status:'nok',source:'M_attach_current_service_to_req', type:'NOT_FOUND',message:'Can\'t find resource'});
    return;
  }
  req.currentRoute = route;
  
  req.currentAccessedService = getServices().find(s=>{
    return s.name === route.serviceProvider;
  })
  
  if(!req.currentAccessedService){
   next({status:'nok',source:'M_attach_current_service_to_req', type:'INVALID_SERVICE',message:'Service not yet available! Contact Administrator!'});
   return;
  }
  console.log(`m_attachCurrentService: `,new Date(), `Service Provider: `,req.currentAccessedService.name);
  next();
}