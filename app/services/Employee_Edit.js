const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;


module.exports = employee_edit = async (req,res,next)=>{

   let { db } = dependencies;
   let employee = req.preLoadedResource['Employee'];
   const query = {  
      _id: ObjectId(employee._id)
   };

   delete req.body.userAccount;
   delete req.body.roles;

   let body = Object.assign(req.body);

   delete body._id;
   
   const update = {
      $set : hantyr.flatten(body)
   }

   let {result} = await db.collection('employees').updateOne(query,update);

   let {nModified,ok} = result;

   if(ok){
      if(nModified === 0){
         res.json({
            ok,
            message: {
               type: 'INFO',text: 'No changes made.'
            }
         });
         return;
      }
      res.json({
         ok,
         message: {
            type: 'SUCCESS', text: `Employee ${employee.employeeId} update success.`
         }
      });
   }

   console.log(result);

   
}


module.exports.api = {
   path : 'employees/:employee',
   method: 'patch',
   resource: 'Employee',
   op: 'edit',
   description: 'Edit Employee.',
   use: ['schemaValidator'],
   schemaValidator: {//schemaValidator options
      schema: 'Employee',
      op: 'edit',
   }
}