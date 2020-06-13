module.exports = (req,res,next)=>{
   console.log('Logout Reached');
   req.logout();
   res.clearCookie('U_SID');
   // res.json({status:'ok',source:'logout',message:'You have been logged out!'});
   res.json({
      ok: 1
   });
}

module.exports.api = {
   path: 'auth/logout',
   method: 'post',
   op: 'exec'
}