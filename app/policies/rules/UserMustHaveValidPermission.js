
const { Rule } = require('../../modules/authorization');

/**
 * 
 * This Rule checks if the current logged in user has a valid permission to access a service.
 * The condition checks if the "permissionRequired" property is not set on the currentAccessedService OR if 
 * it has a truthy value,then it is assumed that the permission is required, permission name maps to service 
 * name so this ule checks if the user has permission with name equals to the currentAccessedService's name.
 * @memberof rules
 * @extends Rule
 */
class UserMustHaveValidPermission extends Rule{
  get condition(){
     return (request)=>{
       //check 
       if(request.currentAccessedService.permissionIsRequired === false){
        return true;         
       }

       let userRoles = request.user.deserializedUserRoles;
        
       if(userRoles && userRoles.length > 0){
        
        //consolidate permissions of each role into 1 array.
        let permissions = [];
        for(let role of userRoles){
         if(role.permissions && role.permissions.length > 0){
          permissions = permissions.concat(role.permissions);
         }
        }

        const distinct = (value,index,self)=>self.indexOf(value) === index;
        let distinctPermissions = permissions.filter(distinct);

        //work on distinct permissions, knowing role may have the same permission
        
        let userHasTheRequiredPermission = distinctPermissions.find((permission)=>{
         return request.currentAccessedService.name === permission.name;
        });

        //permissionIsRequire if the service's does not have the permissionRequired property or , the property has a truthy value;
        if(request.currentAccessedService.permissionIsRequired !== false && !userHasTheRequiredPermission){
         return false;
        }

        if(request.currentAccessedService.permissionIsRequired !== false && userHasTheRequiredPermission){
         return true;
        }
       } 

       return false;
    }
  }
}

module.exports = UserMustHaveValidPermission;
