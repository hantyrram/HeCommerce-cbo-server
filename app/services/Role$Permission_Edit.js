

const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;


/**
 * Removes action property if the value is 0. This is to reduce the size of the Permission Object/Document.
 * e.g 
 * input = { employee: {write : 1, read: 0}}
 * output = {employee: {write: 1}}
 * @param {Permission} p 
 */
function removeZeroAction(p){
   let permission = Object.assign({},p);
   let resourceName = Object.getOwnPropertyNames(permission)[0];
      //delete all permission.resource.action = 0
   for(let actionName of Object.getOwnPropertyNames(permission[resourceName])){
      console.log(Boolean(permission[resourceName][actionName]));
      if(permission[resourceName][actionName] === 0){
         delete permission[resourceName][actionName];
         console.log('deleted',actionName);
         console.log(permission);
      }
   }
   return permission;
}

/**
 * @type {HT~service}
 * @func role_create
 * @memberof Services
 * @desc Adds new permission to a Role.
 */
module.exports = role_permissions_edit = async (req,res,next)=>{ 
   let {db} = dependencies;
   
   let role = req.preLoadedResource['Role'];

   //role has no permissions
   if(!role.permissions || role.permissions.length === 0){
      req.body.forEach(p=>role.permissions.push(p));
   }

   
   // role has permissions, push 
   // new permissions (posted permission with resource name not yet on the role.permissions) 
   // immediately
   req.body.forEach( postedPermission => {
      let postedPermissionResourceName;
      let index = role.permissions.findIndex(existingPermission=> {
         postedPermissionResourceName = Object.getOwnPropertyNames(postedPermission)[0];
         return Boolean(existingPermission[postedPermissionResourceName]);
      });
      postedPermission = removeZeroAction(postedPermission);
      if(index === -1 ){ //postedPermission does not yet exist on the role's permission
         //just add emmediately only if it contains actions
         if(Object.getOwnPropertyNames(postedPermission[postedPermissionResourceName]).length === 0){
            //don't add if permission has no action.
            return;
         }
         role.permissions.push(postedPermission);
         return;
      }

      let existingPermission = role.permissions[index];
      
      let updatedPermission = Object.assign(existingPermission,postedPermission);
      
      let resourceName = Object.getOwnPropertyNames(updatedPermission)[0];

      updatedPermission = removeZeroAction(updatedPermission);

      //updatedPermission does not contain any action as a result of deleting 0 valued actions, 
      //just delete the permission
      if(Object.getOwnPropertyNames(updatedPermission[resourceName]).length === 0){
         role.permissions.splice(index,1);
         return;
      }
      //else replace permission on index.
      role.permissions.splice(index,1,updatedPermission);
      
   });

   let filter = {
      _id: ObjectId(role._id)
   }

   let update = {
      $set : {
         permissions: role.permissions
      }
   }
  
   await db.collection('roles').updateOne(filter,update);

   res.json(await db.collection('roles').find({}).toArray());

   
}


module.exports.api = {
   path : 'roles/:role/permissions',
   method: 'patch',
   resource: 'Role$Permissions',
   op: 'edit',
   description: 'Adds Permission to Role',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Permissions',
   }
}