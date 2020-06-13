
/**
 * @type {typedefs~service}
 * @desc logs out a user.
 */
module.exports = logout = (req,res)=>{
 req.logout();
 res.clearCookie('U_SID');
 let message = new Artifact.Message(Artifact.Message.SUCCESS,'You have been logged out!');
 let artifact = new Artifact(Artifact.OK,'logout',null,message);
 // res.json({status:'ok',source:'logout',message:'You have been logged out!'});
 res.json(artifact);
}

module.exports.permissionIsRequired = false;