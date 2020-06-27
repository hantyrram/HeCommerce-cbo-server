/**
 * Creates an entity credential.
 */

const ObjectId = require('mongodb').ObjectId;
// const { dependencies } = require(`${APP_ROOT }/dependencyManager`);

/**
 * 
 *  
 */
module.exports = async(req,res,next)=>{
   const EMPLOYEE_OWNER_TYPE = "Employee";
   let {db} = hantyr.dependencyManager.dependencies;

   let collection; 

   if(req.body.ownerType === EMPLOYEE_OWNER_TYPE){
      collection = db.collection('employees');
   }else{//implement other ownerType here
      return res.status(404).json({
            error: {
               type: "NOT_FOUND",
               text: "Invalid Owner Type"
            }
      })
   }

   let query;
   let ownerIdKey;

   switch(req.body.ownerType){
      case EMPLOYEE_OWNER_TYPE: {
         ownerIdKey = "employeeId";
         query = {
            [ownerIdKey]: req.body.ownerId
         }
      }

   }
   
   query = {
      [ownerIdKey]: req.body.ownerId
   }

   let entity = await collection.findOne(query);

   if(entity.userAccount && entity.userAccount.credential){
      return res.status(409).json({
         error: { type: 'INVALID_OPERATION',text: 'User Account has existing credential!' }
      });
      
   }

 
   let credential = {  temp: true , username: req.body.username, password: req.body.password };
   let filter = { _id: ObjectId(entity._id)};
   let update = { 
      $set: {  
         "userAccount.credential" : credential,
         "userAccount.ownerType" : req.body.ownerType
      } 
   };
   let options = {
      projection: {
         [ownerIdKey]: 1,
         "userAccount.credential": 1,
         "userAccount.ownerType": 1,
      },
      returnOriginal: false
   }

   let findAndModifyWriteOpResultObject = await collection.findOneAndUpdate(filter,update,options);
   
   console.dir(findAndModifyWriteOpResultObject);

   if(findAndModifyWriteOpResultObject.ok){
      return res.json({
         ok:findAndModifyWriteOpResultObject.ok,
         resource: findAndModifyWriteOpResultObject.value,
         resourceType: 'UserAccount.Credential',
         message: {
            type: 'SUCCESS',
            text: `User Account Credential Created For ${findAndModifyWriteOpResultObject.value[ownerIdKey]}`
         }
      })
     
   }

   res.json({
      error: {
         type: 'SERVER_ERROR',
         text: 'Error Creating Credential. Contact Administrator'
      }
   })
   

}

module.exports.api= {
   path : 'useraccounts/credential',
   method: 'post',
   resource: 'UserAccount.Credential',
   op: 'create',
   description: 'Create Credential',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Credential',
      op: 'create'
   }
}

