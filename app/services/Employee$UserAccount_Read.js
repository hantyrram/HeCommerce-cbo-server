/**
 * Creates an employee credential.
 */
module.exports = employee_useraccount_read = async(req,res,next)=>{
   const ObjectId = require('mongodb').ObjectId;
   const userAccountRoles = require(`${APP_ROOT}/mongodb_op_docs/aggregate/userAccountRoles`);
   let {db} = hantyr.dependencyManager.dependencies;
   let employee = req.preLoadedResource['Employee'];
   //aggregate returns a cursor

   if(employee.userAccount && employee.userAccount.roles && employee.userAccount.roles.length > 0){

      let result = await db.collection('employees').aggregate(userAccountRoles(ObjectId(employee._id))).toArray();
      
      employee.userAccount.roles = result[0].roles;
   }
   
   
  
   res.json({
      ok:1,
      resource: {_owner: employee.employeeId, ...employee.userAccount},
      resourceType: 'Employee$UserAccount'
   })

}
module.exports.api = {
   path : 'useraccounts/:employeeId',
   method: 'get',
   resource: 'Employee$UserAccount',
   op: 'read',
   description: 'Gets The Employee\'s User Account',
}