// delete require.cache[require.resolve('../_registry')];
const _registry = require('../_registry');
const path = require('path');

 /**
  * @global
  * @returns {Array} - The array of services as defined on the services config
  */
 module.exports = getServices = () => _registry.services.map(servicePath => require(path.resolve(process.cwd(),servicePath)));
   
 
 