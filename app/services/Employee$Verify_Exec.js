const {dependencies} = require(DEPENDENCY_MANAGER_PATH);

/**
 * Verifies if the employee id exist.
 * 
 */
module.exports = employee_verify = async (req,res,next)=>{

   let {db} = dependencies;
   
   let {employeeId} = req.body;

   try {
      let employee = await db.collection('employees').findOne(
         {
            employeeId
         },
         {
            projection: {
               employeeId:1,
               "identity.firstname": 1,
               "identity.middlename": 1,
               "identity.lastname": 1,
               "userAccount.credential.username": 1

            }
         }
      )

     if(!employee){
        res.json({
           error: {
              type: 'EMPLOYEE_VERIFICATION_NOK',
              text: 'Employee Id Does Not Exist.'
           }
        })
        return;
     }

     res.json({
        ok:1,
        resource: employee,
        resourceType: 'Employee',
        message: {
         type: 'INFO',
         text: 'Employee Id Verified.'
        }
     });

   } catch (error) {
      console.log('Err: employee_verify ',error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error executing the employee.verify service. Contact Administrator!'
         }
      })
   }

  
}


module.exports.api = {
   path : 'employees/verify',
   method: 'post',
   resource: 'Employee$verify',
   op: 'exec',
   description: 'Verifies If The Employee Id Exist or Valid' ,
   // use: ['schemaValidator'],
   // schemaValidator: {
   //    schema: 'Role',
   //    op: 'delete'
   // }
}