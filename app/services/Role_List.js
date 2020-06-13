
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func role_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = role_list = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   let result = await db.collection('roles').find({}).toArray();
   
   res.json({ok: 1, resource: result, resourceType:'Array', resourceArrayItemType: 'Role'});
}



module.exports.api= {
   path : 'roles',
   method: 'get',
   resource: 'Role',
   op: 'list',
   description: 'List All Roles',
}