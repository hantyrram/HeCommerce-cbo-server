/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;

module.exports = employee_credential_password_change = async(req,res,next)=>{
   res.json({
      error: {
         type: 'SERVICE_NOT_AVAILABLE',
         text: 'Contact Administrator!'
      }
   })

}

module.exports = {
   path : 'employees/:employee/useraccount/credential/password',
   method: 'patch',
   resource: 'Employee$UserAccount$Credential$Password',
   op: 'edit',
   description: 'Change password, sets temp to false.',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Password',
      op: 'edit'
   }
}
