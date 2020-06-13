
const ObjectId = require('mongodb').ObjectId;

module.exports.params = ['product_id'];

module.exports.callback = async function(req,res,next,_id){
   
   const {dependencies} = require('../dependencyManager');

   if(ObjectId.isValid(_id)){

      let product = await dependencies.db.collection('products').findOne({_id: ObjectId(_id)});

      if(product){
         req.preLoadedResource['Product'] = product;
         next();
         return;
      }
      res.json({
         error: {
            type: 'RESOURCE_NOT_FOUND',
            text: 'Employee does not exist'
         }
      })
      return;
   }

   res.json({
      error: {
         type: 'RESOURCE_NOT_FOUND',
         text: 'Invalid Employee Id'
      }
   })

   

   
}