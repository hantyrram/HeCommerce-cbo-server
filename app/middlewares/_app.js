const logger = require('./logger');
const checkRoute = require('./checkRoute');

module.exports = function _app(){
   return [
      logger,
      checkRoute
   ]                                                                         
}