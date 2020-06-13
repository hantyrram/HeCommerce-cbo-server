
// const config = require('../config');
// const getRoute = require('../functions/getRoute');
/**
 *
 * @function checkService
 * @memberof middlewares
 * @type {typedefs~middleware}
 * @desc Checks if there is a service that can handle the route. MUST be preceded by checkRoute middleware.
 * Uses currentRoute attached by checkRoute middleware.
 */
module.exports = checkService = (req,res,next)=>{
   console.log(`checkService: Checking Service...${new Date()}`);
   if(!req.currentRoute){
      res.status(404).json({error:{type:'INVALID_SERVICE',text:'Coudn\'t Determine Resource'}});
      return;
   }
   console.log(`checkService: Checking Service for ${req.currentRoute.url}...`);
   //attache the service 
   req.currentAccessedService = getServices().find(s=>{
      return s.name === req.currentRoute.serviceProvider;
   })
   
   if(!req.currentAccessedService){
      res.status(404).json({source:'m_checkService', type:'INVALID_SERVICE',message:'Service not yet available! Contact Administrator!'});
      return;  
   }
   console.log(`checkService: Using ${req.currentAccessedService.name} For Route ${req.currentRoute.url} `);
   next();
}