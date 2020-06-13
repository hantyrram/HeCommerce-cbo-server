 /**
  * Forwards/pipes the request to other service provider. This allows piping of request to other services.
  * @param {Object} req - The current request object.
  * @param {Object} next - The next object.
  * @param {Service.referer} referer - The referer of the request, defines where the request originated, and
  * the params needed by the service accepting the request.
  * @param {String} to - The name of the service that the request will be forwarded to.
  * 
  */
 function forwardRequest(req,next,referer,to){
   req.app.use(
      (req,res,next)=>{
         req.referer = referer;
         next();
      },
      getService(to)
   )
   next();
 }

 module.exports  = forwardRequest;