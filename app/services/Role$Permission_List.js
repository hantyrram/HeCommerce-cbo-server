
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
module.exports = role_permissions_list = async (req,res,next)=>{ 
   let {db} = dependencies;
   
   let role = req.preLoadedResource['Role'];

   let filter = {
      _id: ObjectId(role._id)
   }

   let options = {
      project: {
         permissions: 1
      }
   }
   
  
   let result = await db.collection('roles').findOne(filter,options);

   res.json(result);

   
}

module.exports.api = {
   path : 'roles/:role/permissions',
   method: 'get',
   resource: 'Role$Permissions',
   op: 'read',
   description: 'Fetch A Role\'s Permissions',
   
}




