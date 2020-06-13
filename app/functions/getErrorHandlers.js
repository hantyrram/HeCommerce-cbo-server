/**
* @returns {Array} - The array of routes as defined on the routes config
*/
module.exports =  getErrorsHandlers = ()=>{
   return config.errorHandlers.map(handler=>{
   return require('../error_handlers/' + handler);
   });
}

