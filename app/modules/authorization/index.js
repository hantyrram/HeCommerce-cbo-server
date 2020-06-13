

/**
 *@module authorization
 */

/**
 * @typedef {userRolesDeserializer}
 * @param {object} user
 * @param {function} done
 * @desc A function that deserializes the user's roles.The function is invoked with the current
 * logged in user as the first parameter, and (the done) function as second parameter.
 * The done function will receive the Array of deserialized roles.
 */

/**
 * @type {Authorization/Typedefs~userRoleDeserializer}
 */
let userRolesDeserializer;


/**
 * @param {Array} policies - Array of policies
 * @return {on} 
 */
const enforce = (policies)=>{
  return {
    on : on.bind({},policies)
  }
}

/**
 * Must be chained after enforce.
 * 
 * @param {Array} policies - The Array of policies.
 * @param {object} request - The http request object.
 */
const on = async (policies,request)=>{
  let error = null;
  policy_test:{
    for(let policy of policies){
      for(let rule of policy){//policy is just an Array of rules
        try{
          rule.check(request);
          console.log('rule check triggered');
        }catch(policyViolation){
          error = policyViolation;
          break policy_test;
        }
      }
    }  
  }
  if(error) throw error;                   
  return true; 
}

/**
 * @export
 * @func
 * @param {Array<Policy>} policies - Array of Policies.
 */                                        
module.exports = (policies) => {
 return (request,response,next)=>{
  console.log('Auth Reached');
  console.log(request.user)
   /**
    * The function passed to the userRoleDeserializer as second parameter, that will receive 
    * the deserialized roles of the currently logged in user. ES5 function is used to allow
    * early binding of the request parameter.
    * @param {object} request - The request object.
    * @param {Array} roles - The deserialized roles of the user.
    * 
    */
   let done = function(roles){
    if(request.user){
     request.user.deserializedUserRoles = roles;
    }
    enforce(policies).on(request).then(()=> next() ).catch(policyViolation=>{
     request.unauthorized = true;
     console.log('Catching Policy Violation');
     // next(policyViolation);//error on first violation
     //?? make this configurable, e.g. if useErrorHandler is true, just call next(policyViolation) don't terminate here
     response.status(403).json({status:'nok',source: 'authorization', error:policyViolation});
    });
   }

   userRolesDeserializer(request.user, done);

 }
}



/**
 * Sets the userRolesDeserilizer function. Must be set in order to use the Authorization module.
 * @function deserializedUserRoles
 * @memberof Authorization
 * @static
 * @param {Typedefs~userRoleDeserializer} fn - The function that deserializes the user roles
 */
module.exports.deserializeUserRoles = (fn)=>{
 userRolesDeserializer = fn;
}
/**
 * @prop {Rule} authorization.Rule
 * @static 
 */
module.exports.Rule = require('./Rule');
/**
 * @prop {Policy} authorization.Policy
 * @static 
 */
module.exports.Policy = require('./Policy');
/**
 * @prop {PolicyViolation} authorization.PolicyViolation
 * @static 
 */
module.exports.PolicyViolation = require('./PolicyViolation');

//ignore , user only has permissions
//user.permissions = 'product_create'
//role is construct outside the database,e.g. define 'admin' 
//will automatically add the permissions on the user