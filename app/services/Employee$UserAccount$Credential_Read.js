/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;


module.exports = employee_useraccount_credential_read = async(req,res,next)=>{
   let {db} = hantyr.dependencyManager.dependencies;

   let employee = await db.collection('employees').findOne(
      {
         _id: ObjectId(req.preLoadedResource['Employee']._id)
      },
      {
         projections: {
            "userAccount.credential.username":1,
            "userAccount.credential.temp":1
         }
      }
   )
  
   res.json({
      ok: 1,
      resource: employee.userAccount.credential,
      resourceType: 'Credential'
   });

}



module.exports = {
   path : 'employees/:employee/useraccount/credential',
   method: 'get',
   resource: 'Employee$UserAccount$Credential',
   op: 'read',
   description: 'Fetch useraccount credential',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Credential',
      op: 'read'
   }
}