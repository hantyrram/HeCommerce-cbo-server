delete require.cache[require.resolve('../_registry')];
const _registry = require('../_registry');
const path = require('path');
/**
 * @global
 * @returns {Array} - The array of middlewares as defined on the middlewares config.
 */
module.exports = getMiddlewares = () =>  _registry.middlewares.map(middlewarePath => require(path.resolve(process.cwd(),middlewarePath)));