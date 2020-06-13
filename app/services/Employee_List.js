const {dependencies} = require(DEPENDENCY_MANAGER_PATH);

module.exports = employee_list = async (req,res,next)=>{
   let {db} = dependencies;
   let employees = await db.collection('employees').find({}).toArray();

   res.json({ 
      ok:1, 
      resource: employees,
      resourceType: 'Array',
      resourceItemType: 'Employee'
   });

}


module.exports.api = {
   path : 'employees',
   method: 'get',
   resource: 'Employee',
   op: 'list',
   serviceProvider: 'app/services/employee/list',
   description: 'List Employees.'
}