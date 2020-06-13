/**
 * @module authentication 
 */
const Artifact = require('../../app/Artifact');

/**
* @callback Authentication~serializationDoneCallback
* @param {object} req - The request object.
* @param {object} res - The response object.
* @param {Object} user - The Credential to be serialized into the session.
* @desc The callback invoked by the @see Authentication~serializeUser.
*/
function serializationDoneCallback(req,res,user){
 req.session.user = user;
 req.session.save();
 let message = new Artifact.Message(Artifact.Message.SUCCESS,'Login Success!');
 let artifact = new Artifact(Artifact.OK,'login',{ entity: userForArtifact }, message);
 // res.json({status:'ok',source:'login',message:'Login Success!',data:{entity : {_id:userObject._id,username:userObject.username}}});
 res.json(artifact);
} 

 /**
* @callback Authentication~serializeUser
* @param {Object} user - The Credential to be serialized into the session.
* @param {serializationDoneCallback} 
* @desc A function which allows the user of this module to decide which part of the user 
* data will be saved on the session, serializer MUST call the serializationDoneCallback passed to 
* it with the user identifier.
*/

/**
 * This class provides handles authentication and login. Checks if the current session has a user.
 * @class 
 * @param {object} options - Authentication configuration options.
 * @param {Authentication~serializeUser} options.serializer - The function used to decide which property of the user to save to the session.
 * @param {Authentication~deserializeUser} options.deserializer - The function used to deserialize the user from session.
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
 * @param {number} verificationTimeout - The timeout in milliseconds before the module responds with "AUTH_TIMEOUT" error.
 * if the login service does not respond.
 * @return {function} - An Express Middleware function.
 */ 
function Authentication(options){
 this.serializeUser = options.serializer;
 this.deserializeUser = options.deserializer;
 this.loginURL  = options.loginURL;
 this.logoutURL = options.logoutURL;
 this.successRedirect = options.successRedirect;
}

/**
 * The Authentication middleware.
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */
Authentication.prototype.authenticate = function (req,res,next){
  /**
   * @func login
   * @inner
   * @desc The login function that will be attached to the req object when the login URL is accessed. This function can be called on a login service, after the service checks if the user sent by the client is a valid user or not.
   * @param {string|null} errMsg - The message that will be attached on the login response if the user is receieved is not a valid user or if there is any other error.
   * @param {Object} user - The user found on the database.
  
   */
  let login = (errMsg,user)=>{
   let userForArtifact = Object.assign({},user);
   if(user === null){
     // res.json({status:'nok',error:{type:'AuthError',message:errMessage,failureRedirect:loginURL}});
     let error = new this.Artifact.Error('AUTHENTICATION_ERROR',errMsg);
     let artifact = new this.Artifact(Artifact.NOK,'login',error);
     // next({status:'nok',source:'login',type:'AUTHENTICATION_ERROR',errMsg:errMsg});
     next(artifact);
     return;
   }

   
   let serializationDoneCallback = (user)=>{
     req.session.user = user;
     req.session.save();
     let message = new Artifact.Message(Artifact.Message.SUCCESS,'Login Success!');
     let artifact = new Artifact(Artifact.OK,'login',{ entity: userForArtifact }, message);
     // res.json({status:'ok',source:'login',message:'Login Success!',data:{entity : {_id:userObject._id,username:userObject.username}}});
     res.json(artifact);
     return;
   } 
   //allow module user to determines which property of the user to save to session. e.g. ID
   this.serializeUser(user,serializationDoneCallback);
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
  if(req.path !== loginURL && req.path !== logoutURL){
   let error = new Artifact.Error('AUTHENTICATION_ERROR','Authentication Failed');
   let artifact = new Artifact(Artifact.NOK,'authenticate',error);
   // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Authentication Failed'});
   next(artifact);
   return;
  }
   // req.path === loginURL, attach the login function, which can be invoked on the login service

   req.login = login;
   //proceed delegate to login service
   next();
   return;
 }

 //
 //function passed to the deserializer
 let done = (user)=>{
   
   if(!user){
     //this error might happen when there is an existing session.user but the user was already deleted on the database
     // res.json({status:'nok',error:{type:'AuthError',message:'user not found on db',failureRedirect:loginURL}});
     let error = new Artifact.Error('AUTHENTICATION_ERROR','Invalid User');
     let artifact = new Artifact(Artifact.NOK,'authenticate',error);
     // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Invalid User',failureRedirect:loginURL});
     next(artifact);
     return;
   }
   //accessing /login when there's already an existing user session
   if(req.path === loginURL){
     let message = new Artifact.Message(Artifact.Message.SUCCESS,'Already Logged In!');
     let artifact = new Artifact(Artifact.OK,'login',{ entity: user }, message);
     // res.json({status:'ok',source:'login',message:'Already Logged in!',data:{user:user}});
     res.json(artifact);
     return;
   }
   req.user = user;
   next();    
 }

 this.deserializeUser(req.session.user,done);
 }
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
 let loginURL = options.loginURL || '/apiv1/login';
 let logoutURL = options.logoutURL || '/apiv1/logout';
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
  * @desc The login function that will be attached to the req object when the login URL is accessed. This function can be called on a login service, after the service checks if the user sent by the client is a valid user or not.
  * @param {string|null} errMsg - The message that will be attached on the login response if the user is receieved is not a valid user or if there is any other error.
  * @param {Object} user - The user found on the database.
 
  */
  let login = (errMsg,user)=>{
    let userForArtifact = Object.assign({},user);
    if(user === null){
      // res.json({status:'nok',error:{type:'AuthError',message:errMessage,failureRedirect:loginURL}});
      let error = new Artifact.Error('AUTHENTICATION_ERROR',errMsg);
      let artifact = new Artifact(Artifact.NOK,'login',error);
      // next({status:'nok',source:'login',type:'AUTHENTICATION_ERROR',errMsg:errMsg});
      next(artifact);
      return;
    }
  
    
    let serializationDoneCallback = (user)=>{
      req.session.user = user;
      req.session.save();
      let message = new Artifact.Message(Artifact.Message.SUCCESS,'Login Success!');
      let artifact = new Artifact(Artifact.OK,'login',{ entity: userForArtifact }, message);
      // res.json({status:'ok',source:'login',message:'Login Success!',data:{entity : {_id:userObject._id,username:userObject.username}}});
      res.json(artifact);
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
   if(req.path !== loginURL && req.path !== logoutURL){
    let error = new Artifact.Error('AUTHENTICATION_ERROR','Authentication Failed');
    let artifact = new Artifact(Artifact.NOK,'authenticate',error);
    // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Authentication Failed'});
    next(artifact);
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
      let error = new Artifact.Error('AUTHENTICATION_ERROR','Invalid User');
      let artifact = new Artifact(Artifact.NOK,'authenticate',error);
      // next({status:'nok',source:'authenticate',type:'AUTHENTICATION_ERROR',errMsg:'Invalid User',failureRedirect:loginURL});
      next(artifact);
      return;
    }
    //accessing /login when there's already an existing user session
    if(req.path === loginURL){
      let message = new Artifact.Message(Artifact.Message.SUCCESS,'Already Logged In!');
      let artifact = new Artifact(Artifact.OK,'login',{ entity: user }, message);
      // res.json({status:'ok',source:'login',message:'Already Logged in!',data:{user:user}});
      res.json(artifact);
      return;
    }
    req.user = user;
    next();    
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
