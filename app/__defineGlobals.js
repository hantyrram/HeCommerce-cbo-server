const path = require('path');

module.exports = function(){
   console.log(__dirname);
   Object.defineProperty(global,'APP_ROOT',{ value: __dirname,writable:false,configurable:false});
   // global.APP_ROOT = __dirname;
   global.SCHEMAS_PATH = __dirname + '/schemas';
   global.hantyr = {
      DOMAIN:`http://localhost:${process.env.PORT || 8080}`,
      APP_ROOT: `${__dirname}`,
      /**
       * Root folder of the server directory
       */
      SERVER_ROOT: `../${__dirname}`,
      dependencyManager: require('./dependencyManager'),
      flatten : require('./functions/flatten'),
      getPermissions: require('./functions/getPermissions'),
      randomStrGenerator: require('./functions/randomStrGenerator'),
      function : {
         flatten : require('./functions/flatten')
      }
   }

   /**
    * Static files database folder
    */
   global.STATICDB_DIR = path.join(__dirname,'../','staticdb');
   global.dependencyManager = require('./dependencyManager');
   global.hantyr.paths = [];

   global.hantyr.paths['schemas'] = `${__dirname}/schemas`;
}