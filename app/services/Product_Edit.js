 
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;
/**
 * @type {HT~service}
 * @func product_edit
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = product_edit = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {

      await db.collection('products').createIndex({"name" : 1},{unique: 1});

      if(req.body.category_id){
         let category = await db.collection('productCategories').findOne({_id: ObjectId(req.body.category_id)});
         if(!category){
            res.json({
               error: {
                  type: 'INVALID_REFERENCE',
                  message: 'Category Id does not exist.'
               }
            })
            return;
         }
      }

      let product = hantyr.function.flatten(req.body);

      let { ok, value: updatedProduct } = await db.collection('products').findOneAndUpdate(
         {
            _id: ObjectId(req.params.product_id)
         },
         {
            $set: product
         },
         {
            returnOriginal: false
         }

      )


      res.json({
         ok,
         resource: updatedProduct,
         resourceType: 'Product'
      })

   } catch (error) {
      console.log(error);
      if(error.code === 11000){
         res.json({
            error: {
               type: 'DUPLICATE_ERROR',
               text: `${error.keyValue.name} already exist.`
            }
         });
         return;
      }
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Updating Product. Contact Admin.'
         }
      })
   }
}




module.exports.api = {
   path : 'products/:product_id',
   method: 'patch',
   resource: 'Product',
   op: 'edit',
   description: 'Update Single Product',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Product',
      op: 'edit'
   }
}