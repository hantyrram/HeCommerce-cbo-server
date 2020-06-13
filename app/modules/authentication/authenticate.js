/**
 *@type {typedefs~service}
 *@desc Authenticates the user.
 */
module.exports = authenticate = (req,res,next)=>{
  const data = {
   entity : {
    ...req.user,
    type: "user"
   }
  }
  res.status(200).json({status:'ok',source:'authenticate',message:'Authentication Success!',data});
}

module.exports.permissionIsRequired = false;