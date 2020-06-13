/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;

module.exports = employee_credential_revoke = async(req,res,next)=>{

   let {db} = hantyr.dependencyManager.dependencies;
   let employee = req.preLoadedResource['Employee'];
   let filter = { _id: ObjectId(employee._id)};
   let update = { $set: {  "userAccount.credential.revoked" : true} };
   let options = {
      projection: {
         "userAccount.credential.temp": 1,
         "userAccount.credential.username": 1,
         "userAccount.credential.revoked": 1,
         
      },
      returnOriginal: false
   }

   let { value } = await db.collection('employees').findOneAndUpdate(
      filter,
      update,
      options
   );

   res.json({
      ok:1,
      resource: value,
      resourceType: 'Credential'
   });

}

module.exports.api = {
   path : 'employees/:employee/useraccount/credential/revoke',
   method: 'patch',
   resource: 'Employee$UserAccount$Credential$Revoke',
   op: 'exec',
   description: 'Revokes employee credential',
}
