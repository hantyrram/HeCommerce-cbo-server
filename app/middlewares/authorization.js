const {serviceUsePolicy} = require('../policies');
const authorizationModule = require('../modules/authorization');
const {dependencies} = require('../dependencyManager');
authorizationModule.deserializeUserRoles(function(currentLoggedInUser,done){
   let {db} = dependencies;

   if(!currentLoggedInUser){
      let roles = [];
      done(roles);
      return;
   }
 
   if(currentLoggedInUser.roles !== undefined && currentLoggedInUser.roles.length !== 0){
    //query roles with role names = the current user's roles e.g. ['admin','product_manager']
    let QUERY = {
      $or : currentLoggedInUser.roles.map(roleName=>{return {name:roleName}})
    }

    db.collection('roles')
    .find(QUERY)
    .toArray(function(error,roles){
        done(roles);
    });
   }
  });
 
module.exports = authorization = (req,res,next)=>{
   //turn on authorization module during development
   if(process.env.NODE_ENV === 'development' ){
      return process.env.DEV_AUTHORIZATION === 'enabled'?
      authorizationModule([serviceUsePolicy]): // enable authorization on development mode
                  (req,res,next)=> next(); // skip authorization on development mode if DEV_AUTHORIZATIOn is not present
   }
   //enable authorization by default
   return authorizationModule([serviceUsePolicy]);
}