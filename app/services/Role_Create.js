
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func role_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = role_create = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   let { insertedId, result} = await db.collection('roles').insertOne(req.body);
   
   if(result.ok && result.n === 1){

      res.json({
         ok:1,
         resource: {_id: insertedId},
         resourceType: 'Role',
         resourceHref: '/apiv1/admin/roles/' + insertedId
      })
      return;
   }
   res.json({
      error: {
         type: 'CREATE_FAILED',
         text: 'Error Creating Role.'
      }
   })
}


module.exports.api = {
   path : 'admin/roles',
   method: 'post',
   resource: 'Role',
   op: 'create',
   description: 'Creates a new Role',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Role',
      op:'create'
   }
}
