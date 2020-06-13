
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;

/**
 * @type {HT~service}
 * @func role_delete
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = role_delete = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {
      
      let {result,deletedCount} = await db.collection('roles').deleteOne({
         _id: ObjectId(req.preLoadedResource['Role']._id)
      })

      res.json({
         ok: 1,
         resource: req.preLoadedResource['Role'],
         resourceType: 'Role',
         message: {
            type: 'OP_SUCCESS',
            text: 'Role Deleted Successfully'
         }
      })
   } catch (error) {
      res.json({
         error: {
            type: 'ROLE_DELETE_ERROR',
            text: 'Error Deleting Role!'
         }
      })
      console.log(error);
   }
   // res.json({
   //    ok:1,
   //    resource: req.body,
   //    resourceType: 'Role',
   //    resourceHref: '/apiv1/admin/roles/' + req.preLoadedResource['Role']._id
   // })
  
}


module.exports.api = {
   path : 'admin/roles/:role',
   method: 'delete',
   resource: 'Role',
   op: 'delete',
   description: 'Remove Role',
   // use: ['schemaValidator'],
   // schemaValidator: {
   //    schema: 'Role',
   //    op:'edit'
   // }
}