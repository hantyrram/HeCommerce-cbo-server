
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
/**
 * @type {HT~service}
 * @func employee_addEidManual
 * @memberof Services
 * @desc Creates a new Employee Profile, providing the employee id manually.
 */
module.exports = employee_addEidManual = async (req,res,next)=>{ 
   
   let { db } = dependencies;

   let {result,insertedId} = await db.collection('employees').insertOne(req.body);
   
   res.status(201).json({
      ok: result.ok,
      resource: { _id: insertedId },
      resourceHref: '/employees/' + insertedId,
      resourceType: 'Employee',
      code: 201,
   })
}

module.exports.api = {
   path : 'employees/empid_manual',
   method: 'post',
   resource: 'Employee',
   op: 'create_empidManual',
   use: ['schemaValidator'],
   desciption: 'Create a new employee profile. Must provide employee id.',
   schemaValidator: {
      schema: 'Employee',
      op: 'create_empidManual'
   }
}