module.exports.error = function(code,type,text){

   const NOT_FOUND = 404;
   const UNAUTHORIZED = 401;
   const BAD_REQUEST = 400;
   const REQUEST_TIMEOUT = 408;
   const SERVICE_UNAVAILABLE = 503;
   

   const CODES = [400,401,403,404]
   return {
      
   }
}

module.exports.success = function(code,message){}

module.exports.validation = function(){}