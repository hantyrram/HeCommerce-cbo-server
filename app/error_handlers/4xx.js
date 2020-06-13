
/**
 * Authentication has failed
 */
module.exports = function(artifact,req,res,next){

   if(artifact.error && artifact.error.type){
    switch(artifact.error.type){
      case 'AUTHENTICATION_ERROR':res.status(401).json(artifact);break;
      case 'NOT_FOUND':{res.status(404).json(artifact);}break;
      case 'DUPLICATE_KEY_VIOLATION':res.status(409).json(artifact);break;
      case ERRORS.VALIDATION_ERROR: res.status(422).json(artifact);break;
      default:res.status(400).json(artifact);
    }
    return;
  }
  //no error type server error;
  next(artifact);
}

