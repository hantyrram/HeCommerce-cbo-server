
const ObjectId = require('mongodb').ObjectId;

module.exports.params = ['role'];

module.exports.callback = async function(req,res,next,id){
   
   const {dependencies} = require('../dependencyManager');

   if(ObjectId.isValid(id)){

      let role = await dependencies.db.collection('roles').findOne({_id: ObjectId(id)});

      console.log('Role',role);
      if(role){
         req.preLoadedResource['Role'] = role;
         next();
         return;
      }
      res.json({
         error: {
            type: 'RESOURCE_NOT_FOUND',
            text: 'Role does not exist'
         }
      })
      return;
   }

   res.json({
      error: {
         type: 'RESOURCE_NOT_FOUND',
         text: 'Invalid Role Id'
      }
   })

   

   
}