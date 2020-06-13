
const authentication = require('./modules/authentication');
const ObjectId = require('mongodb').ObjectId;
const { dependencies }  = require('./dependencyManager');

module.exports = function(app){
   const { db } = dependencies;
   authentication.serializeUser(function(user,done){
      done(user._id);//save the _id only to the session
   });
   authentication.deserializeUser(function(id,done){
      const  OPTIONS = {
         projection:{"userAccount.credential.password":0}
      };

      (async ()=>{
         try {
            const { _id,employeeId, userAccount, photo } = await db.collection('employees').findOne({_id: ObjectId(id)},OPTIONS);   
            done({
               _id,employeeId,userAccount,photo
            });
         } catch (error) {
            console.log(`@__initAuthentication: 22`,error);
         }
         
         
      })()
      
   });
   
   if(process.env.NODE_ENV === 'development'){
      if(process.env.DEV_AUTHENTICATION === 'enabled'){
         ////turn on authentication module during development if DEV_AUTHENTICATION is set
         app.use(authentication.init(
            {                
                  loginURL:`/cbo/apiv1/auth/login`, 
                  logoutURL: '/cbo/apiv1/auth/logout', 
                  successRedirect: '/',
                  useInternalLoginService: false              
            }
         )); 
      }else{

         //DEVELOPMENT MODE && !DEV_AUTHENTICATION
         app.use((req,res,next)=>{
            //attach a dummy user on development mode.
            req.user = {
               userAccount :{
                  credential: {
                     username: 'devuser_testuser'
                  }
               }
            }
            next();
         });
      }  
   
      //turn on authorization module during development
      // if(process.env.DEV_AUTHORIZATION === 'enabled'){
      //    //enabled authentication on development
      //    app.use(authorization([serviceUsePolicy]));
      // }
   }else{
      //use authentication and authorization by default
      app.use(authentication.init(
         { 
            loginURL:`/apiv1/auth/login`, logoutURL: '/apiv1/auth/logout', useInternalLoginService: false
         }
      )); 
      //  app.use(authorization([serviceUsePolicy]));
   }
}