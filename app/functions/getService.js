 /**
  * @global
  * @param {String} serviceName = The name of the service.
  * @returns {Array} - The service with the given name.
  */
 module.exports = getService = (serviceName) =>{
   return getServices().filter(service => {
      return service.name === serviceName
   })[0];
 }