
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func role_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = role_read = async (req,res,next)=>{ 
   
   res.json({
      ok:1,
      resource: req.preLoadedResource['Role'],
      resourceType: 'Role'
   })
}


module.exports.api = {
   path : 'roles/:role',
   method: 'get',
   resource: 'Role',
   op: 'read',
   description: 'Get a single Role.',
}