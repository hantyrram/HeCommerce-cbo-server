
module.exports = employee_read = async (req,res,next)=>{
   
   let employee = Object.assign({},req.preLoadedResource['Employee']);
   delete employee.userAccount;
   delete employee._metadata;

   console.log(employee);
   res.json({
      ok:1,
      resource: employee,
      resourceType: "Employee"
   })
}

module.exports.api = {
   path : 'employees/:employee',
   method: 'get',
   resource: 'Employee',
   op: 'read'
}

