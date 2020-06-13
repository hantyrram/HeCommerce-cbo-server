/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;
// const { dependencies } = require(`${APP_ROOT }/dependencyManager`);

module.exports = credential_create_auto = async(req,res,next)=>{
   // let employee = req.preLoadedResource['Employee'];
   let {db} = hantyr.dependencyManager.dependencies;
   console.log(req.preLoadedResource['Employee']);
   let employee = await db.collection('employees').findOne(
      { _id: ObjectId(req.preLoadedResource['Employee']._id) }
   );

   if(employee.userAccount && employee.userAccount.credential){
      res.json({error: {type: 'INVALID_OPERATION',text: 'User Account has existing credential!'}});
      return;
   }

 
   let credential = {  temp: true , ...req.body };
   let filter = { _id: ObjectId(employee._id)};
   let update = { $set: {  "userAccount.credential" : credential} };
   let options = {
      projection: {
         employeeId: 1,
         "userAccount.credential": 1,
      },
      returnOriginal: false
   }

   let {ok,value,lastErrorObject} = await db.collection('employees').findOneAndUpdate(filter,update,options);
   //createHref('employee_userAccount_credential',employee);because it will use the employee id
   //credential
   if(ok){
      res.json({
         ok,
         resource: value,
         resourceType: 'UserAccount.Credential',
         message: {
            type: 'SUCCESS',
            text: `User Account Credential Created For ${value.employeeId}`
         }
      })
      return;
   }

   res.json({
      error: {
         type: 'SERVER_ERROR',
         text: 'Error Creating Credential. Contact Administrator'
      }
   })
   

}

module.exports.api= {
   path : 'employees/:employee/useraccount/credential',
   method: 'post',
   resource: 'Employee$UserAccount$Credential',
   op: 'create',
   description: 'Create Credential For A Given Employee.',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Credential',
      op: 'create'
   }
}

