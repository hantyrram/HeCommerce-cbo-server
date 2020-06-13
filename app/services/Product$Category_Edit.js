 
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;
/**
 * @type {Hantyr~service}
 * @memberof Services
 * @desc Add or Update a product's category.
 */
module.exports = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {
      await db.collection('products').createIndex({"name" : 1},{unique: 1});
      let category = await db.collection('productCategories').findOne({_id: ObjectId(req.body._id)});
      if(!category){
         res.status(404).json({
            error: {
               type: 'NOT_FOUND',
               message: 'Category Not Found'
            }
         })
         return;
      }

      // let product = hantyr.function.flatten(req.body);

      let { ok, value: updatedProduct } = await db.collection('products').findOneAndUpdate(
         {
            _id: ObjectId(req.params.product_id)
         },
         {
            $set: {
               category: req.body
            }
         },
         {
            returnOriginal: false
         }

      )


      res.json({
         ok,
         resource: updatedProduct,
         resourceType: 'Product',
         message: {
            type: 'SUCCESS', text: 'Product Category Changed.'
         }
      })

   } catch (error) {
      console.log(error);
      // if(error.code === 11000){
      //    res.json({
      //       error: {
      //          type: 'DUPLICATE_ERROR',
      //          text: `${error.keyValue.name} already exist.`
      //       }
      //    });
      //    return;
      // }
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Updating Product. Contact Admin.'
         }
      })
   }
}




module.exports.api = {
   path : 'products/:product_id/category',
   method: 'patch',
   resource: 'Product',
   op: 'edit',
   description: 'Add or Update Product Category',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'ProductCategory',
      op: 'edit'
   }
}