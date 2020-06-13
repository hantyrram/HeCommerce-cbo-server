module.exports = function(){
   console.log(__dirname);
   Object.defineProperty(global,'APP_ROOT',{ value: __dirname,writable:false,configurable:false});
   // global.APP_ROOT = __dirname;
   global.SCHEMAS_PATH = __dirname + '/schemas';
   global.hantyr = {
      DOMAIN:`http://localhost:${process.env.PORT || 8080}`,
      APP_ROOT: `${__dirname}`,
      dependencyManager: require('./dependencyManager'),
      flatten : require('./functions/flatten'),
      getPermissions: require('./functions/getPermissions'),
      randomStrGenerator: require('./functions/randomStrGenerator'),
      function : {
         flatten : require('./functions/flatten')
      }
   }
   global.hantyr.paths = [];

   global.hantyr.paths['schemas'] = `${__dirname}/schemas`;
}