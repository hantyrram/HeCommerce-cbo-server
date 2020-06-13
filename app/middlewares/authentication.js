const authenticationModule = require('../modules/authentication');
const {dependencies} = require('../dependencyManager');

authenticationModule.serializeUser(function(user,done){
   done(user._id);//save the _id only to the session
});

authenticationModule.deserializeUser(function(id,done){
   let {db} = dependencies;
   let OPTIONS = {
      projection:{"credential.password":0}
   };

   db.collection('employees').findOne(ObjectID(id),OPTIONS,function(err,employee){
      const { _id, empID, fname, lname, roles, credential  } = employee;
      let user = { _id, empID, fname, lname, roles, credential: { username: credential.username} };
      done(user);
   });
});

module.exports = authentication = (req,res,next)=>{
   if(process.env.NODE_ENV === 'development'){
      if(process.env.DEV_AUTHENTICATION === 'enabled'){
         ////turn on authentication module during development if DEV_AUTHENTICATION is set
         return authenticationModule.init({ Artifact: global.Artifact, loginURL:`/${config.API_VERSION}/login` }); 
      }else{
         return (req,res,next)=>{
            //attach a dummy user on development mode.
            req.user = {
               credential: {
                  username: 'devuser_testuser'
               }
            }
            next();
         };
      }  
   
    
   }
   return authenticationModule.init({ Artifact: global.Artifact, loginURL:`/${config.API_VERSION}/login` }); 

}
