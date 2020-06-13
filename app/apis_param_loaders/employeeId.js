

module.exports.params = ['employeeId'];

module.exports.callback = async function(req,res,next,employeeId){
   
   const {dependencies} = require('../dependencyManager');

   let filter = {employeeId};
   let options = { 
      projection: {
         "userAccount.credential.password": 0
      }
   };

   let employee = await dependencies.db.collection('employees').findOne(
      filter,
      options
   );

   if(employee){
      req.preLoadedResource['Employee'] = employee;
      next();
      return;
   }

   res.json({
      error: {
         type: 'RESOURCE_NOT_FOUND',
         text: 'Employee Id does not exist'
      }
   })
   
   

   
}