/**
 * User is authenticated but does not have permission to access the resource/service
 */

module.exports = (err,req,res,next)=>{
  if(err.type === "POLICY_VIOLATION"){
   res.status(403).json({status:'nok',error:err});
   return;
  }
  next(err);
 } 