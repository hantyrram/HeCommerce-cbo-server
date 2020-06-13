const path = require('path');

const ROUTES_PATH =  path.join(__dirname,'routes');
const SERVICES_PATH = path.join(__dirname,'services');
const MIDDLEWARES_PATH = path.join(__dirname,'middlewares');

console.log('@_registry:7',MIDDLEWARES_PATH);

module.exports = {
   routes: [
      `${ROUTES_PATH}/_all`,
      `${ROUTES_PATH}/serviceone`,
      `${ROUTES_PATH}/servicetwo`,
      `${ROUTES_PATH}/permission_browse_experimental`,
      
   ],
   
   
   middlewares: [ //middlewares folder
      //registers middlware that will be made available to the app, this does not use the middleware
      //to use the middleware define it on the route
      // `${MIDDLEWARES_PATH}/_app`,
      `${MIDDLEWARES_PATH}/logger`,
      `${MIDDLEWARES_PATH}/bodylogger`,
      `${MIDDLEWARES_PATH}/handleNonXHR`,
      `${MIDDLEWARES_PATH}/checkService`,
      // `${MIDDLEWARES_PATH}/authentication`,
      // `${MIDDLEWARES_PATH}/authorization`,
      `${MIDDLEWARES_PATH}/schemaValidator`,


   ],
   
   
   services: [//services folder
      `${ROUTES_PATH}/_all`,
      `${SERVICES_PATH}/test_services/serviceone`,
      `${SERVICES_PATH}/test_services/servicetwo`,
      `${SERVICES_PATH}/test_services/permission_browse_experimental`,
   ]
}


