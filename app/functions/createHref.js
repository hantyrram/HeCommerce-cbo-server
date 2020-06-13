//create HREF string for a resource
const getApis = require('./getApis');


/**
 * @param {String} resource Name of the resource.
 * @param {String} action Action of the api.
 * @param {Object} params Object with keys that maps to the parameters defined on the api path. E.e.
 * {employee: <employeeId>} maps to employees/:employee
 */
module.exports = createHref = (resource,action,params)=>{
   let api = getApis.find( api => api.resource === resource && api.action === action);

   if(!api){
      return null;
   }

   let href = 
   
}