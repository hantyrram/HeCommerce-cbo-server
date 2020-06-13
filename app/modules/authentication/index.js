/**
 * @module authentication 
 */


/**
* @typedef {function} authentication~serializer
* @param {Object} user - The Credential to be serialized into the session.
* @param {serializationDoneCallback} 
* @desc A function which allows the user of this module to decide which part of the user 
* data will be saved on the session, serializer MUST call the serializationDoneCallback passed to 
* it with the user identifier.
*/

let serializer;


/**
* @typedef {function} deserializer
* @param {Object} user - The previously serialized user data.
* @param {@callback} done - The callback once the user is deserialized.
* @desc Deserializer function, hydrates a user, given a user identifier (e.g. user.id) previously provided during serialization,
* saved on the session. 
* 
*/

let deserializer;

/**
 * Sets the serializer to be used by this module.
 * @func
 * @param {serializer} fn - The serializer function.
 */  
module.exports.serializeUser = (fn)=>{
 serializer = fn;
}

/**
 * Sets the deserializer function
 * @func
 * @param {deserializer} fn - The deserializer function.
 */
module.exports.deserializeUser = (fn)=>{
 deserializer = fn;
}



/**
 * Initializes the Authentication module with some options. 
 * @func init
 * @param {object} options - The options object. With the following properties:
 * @param {string} options.loginURL - The login URL.
 * @param {string} options.logoutURL - The logout URL.
 * @param {string} options.successRedirect - The path the user will be redirected to when the authentication is successful. This will be
 * included on the payload, sent to the client.
 * @param {boolean} options.useInternalLoginService - if true, authentication will terminate on this module, response/error response
 * will be sent next will not be called. If false the validationn logic will be delegated to a login service. 
 * A login service will provide a user to the "done" callback passed on the function fn at req.login(fn)
 * if user is null AuthError is passed to next(),else allow req to proceed so next() is called.
 * 
 * deserializeUser = <required> A function that accepts the data that has been set during serialization e.g. user or user.id,
 * and a done function.
 * @param {Artifact} options.Artifact - The Artifact constructor to use for the response.
 * @return {function} - An Express Middleware function.
 */
module.exports.init = (options = {})=>{
 //save the authenticatedUser,nope?
 let {Artifact} = options;
 let loginURL = options.loginURL || '/login';
 let logoutURL = options.logoutURL || '/logout';
 let successRedirect = options.successRedirect || '/';
 let useInternalLoginService = options.useInternalLoginService || false;

 return (req,res,next)=>{
  //if no session, go to /login
  //test remove this line
  // req.session.user = "5bca58d4e7179a4377ff835d";
  console.log('@authentication',{sessionID:req.session.id})

  /**
  * @func login
  * @inner
  * @desc The login function that will be attached to the req object when the login URL is accessed. 
  * This function can be called on a login service, after the service checks if the user sent by the 
  * client is a valid user or not.
  * @param {string|null} errMsg - The message that will be attached on the login response if the user 
  * is receieved is not a valid user or if there is any other error.
  * @param {Object} user - The user found on the database.
  */
   let login = (errMsg,user)=>{
      let userObject = Object.assign({},user);
      if(user === null){
         // res.json({status:'nok',error:{type:'AuthError',message:errMessage,failureRedirect:loginURL}});
         // let error = new Artifact.Error('AUTHENTICATION_ERROR',errMsg);
         // let artifact = new Artifact(Artifact.NOK,'login',error);
         // next({status:'nok',source:'login',type:'AUTHENTICATION_ERROR',errMsg:errMsg});
         // next(artifact);
         res.status(401).json({
            nok: 1,
            error: errMsg,
            failureRedirect: loginURL
         })
         return;
      }

      
      let serializationDoneCallback = (user)=>{
         req.session.user = user;
         req.session.save();
         // res.json({status:'ok',source:'login',message:'Login Success!',data:{entity : {_id:userObject._id,username:userObject.username}}});
         res.json({
            ok:1,
            resource: userObject,
            resourceType: 'UserAccount',
            message: {
               type: 'SUCCESS',
               text: 'Login Success'
            }
         })
         return;
      } 
      //allow module user to determines which property of the user to save to session. e.g. ID
      serializer(user,serializationDoneCallback);
  }//login end
  

 /**
  * Destroys the session and clears the cookie. 
  * @func logout
  * @inner
  * @desc The logout function that will be attached to the req object.
  */
  let logout = ()=>{
    req.session.destroy();
    res.clearCookie(req.session.cookie.name);
  }//logout end

  req.logout = logout;
  
  if(!req.session || !req.session.user){
   //send authentication error when req has no session but client is accessing url that is neither /login /logout (auth links)
   if(req.path !== loginURL && req.path !== logoutURL){
      //  let error = new Artifact.Error('AUTHENTICATION_ERROR','Authentication Failed! Please login!');
      //  let artifact = new Artifact(Artifact.NOK,'authenticate',error);
      // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Authentication Failed'});
      res.status(401).json({
         nok:1,
         error: {
            type: 'AUTH_ERROR',
            text: 'Unauthorized!'
         }
      });
      return;
   }
    //req.path === loginURL
    //attach the login function, which can be invoked on the login service
    //errMessage to send to client
    //user object 
    req.login = login;
    //proceed
    next();
    return;
  }

  //
  //function passed to the deserializer
   let done = (user)=>{
      
      if(!user){
         //this error might happen when there is an existing session.user but the user was already deleted on the database
         // res.json({status:'nok',error:{type:'AuthError',message:'user not found on db',failureRedirect:loginURL}});
         // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Invalid User',failureRedirect:loginURL});
         // next(artifact);
         res.status(401).json({
            nok: 1,
            error: {
               type: 'AUTH_ERROR',
               text: 'Unauthorized. Invalid User!'
            },

            failureRedirect: loginURL
         })
         return;
      }
      //accessing /login when there's already an existing user session
      if(req.path === loginURL){
      // let message = new Artifact.Message(Artifact.Message.SUCCESS,'Already Logged In!');
      // let artifact = new Artifact(Artifact.OK,'login',{ entity: user }, message);
      // res.json({status:'ok',source:'login',message:'Already Logged in!',data:{user:user}});
         res.json({
            ok:1,
            resource: user,
            resourceType: 'Employee.UserAccount',
            message: {
               type: 'SUCCESS',
               text: 'Already Logged In!'
            }
         });

         return;
      }
      req.user = user;
      next(); //l    
   }

   deserializer(req.session.user,done);
   }
}


/**
 * The function passed to the serializer that MUST be invoked and supplied with a user identifier
 * that will be attached to the session.
 * @typedef {function} serializationDoneCallback
 * @param {Object} user
 */
