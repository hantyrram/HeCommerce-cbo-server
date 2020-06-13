const {ERRORS} = require('../config');
module.exports = (artifact,req,res,next)=>{
 console.log(artifact);
 if(artifact.error && artifact.error.type){
  switch(artifact.error.type){
    case ERRORS.SERVER_ERROR_SCHEMA_NOT_FOUND_ON_ROUTE :res.status(500).json(artifact);break;
    default:res.status(500).json(artifact);
  }
  return;
 }
  res.status(500).json(artifact);
}