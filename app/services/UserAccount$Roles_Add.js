/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;

/**
 * Adds role to user account.
 */
module.exports = async(req,res,next)=>{

   console.log(req.body);
   const EMPLOYEE_OWNER_TYPE = "Employee";

   let {db} = hantyr.dependencyManager.dependencies;
   let collection; 

   if(req.params.ownerType === EMPLOYEE_OWNER_TYPE){
      collection = db.collection('employees');
   }else{//implement other ownerType here
      return res.status(404).json({
            error: {
               type: "NOT_FOUND",
               text: "Invalid Owner Type"
            }
      })
   }

   let ownerIdKey;

   switch(req.body.ownerType){
      case EMPLOYEE_OWNER_TYPE: {
         ownerIdKey = "employeeId";
         query = {
            [ownerIdKey]: req.body.ownerId
         }
      }

   }

   let role = await db.collection('roles').findOne({_id: ObjectId(req.body._id)});
   
   if(!role){
      res.json({error: {type: 'RESOURCE_NOT_FOUND',text: 'Role not found!'}});
      return;
   }
   let filter = { "userAccount.credential.username": req.params.username};   
   let update = { $addToSet: {  "userAccount.roles": { role_id: ObjectId(req.body._id) } } } ;
   let options = {
      projection: {
         "userAccount.roles": 1
      },
      returnOriginal: false
   }


   let result = await collection.findOneAndUpdate(filter,update,options);  
      console.log('Result ',result);
      res.json({
         ok: 1,
         resource : role,
         resourceType: 'UserAccount.Roles',
         message: {
            type: 'SUCCESS',
            text: 'Role Added To User Account.'
         }
      });
 
      

}

module.exports.api = {
   path : 'useraccounts/:username/:ownerType/roles',
   method: 'put',
   resource: 'UserAccount.Roles',
   op: 'add',
   description: 'Add Role to User Account',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Role',
      op: 'assign'
   }
}

