//so no need to restart every time a new entry on registry is added
delete require.cache[require.resolve('../_registry')];
const _registry = require('../_registry');
const path = require('path');

/**
 * @returns {Array} - The array of routes as defined on the registry.
 */
module.exports = getRoutes = () => _registry.routes.map(routePath => require(path.resolve(process.cwd(),routePath)));

//get routes path, 
//require each