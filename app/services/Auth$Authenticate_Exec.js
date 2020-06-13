module.exports = (req,res,next)=>{
   console.log('Authenticate Reached');
   res.json({
      ok: 1,
      resource: req.user,
   });
}

module.exports.api = {
   path: 'auth/authenticate',
   method: 'post',
   op: 'exec'
}