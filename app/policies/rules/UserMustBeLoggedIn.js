
const { Rule } = require('../../modules/authorization');

/**
 * 
 * Checks that the user is authenticated.
 * @memberof rules
 * @extends Rule
 */
class UserMustBeLoggedIn extends Rule{
 get condition(){
    return (request)=>{     
      if(request.currentAccessedService.permissionIsRequired === false){
       return true;
      }
      
      if(!request.user){
       return false;
      }
      return true;
   }
 }
}

module.exports = UserMustBeLoggedIn;
