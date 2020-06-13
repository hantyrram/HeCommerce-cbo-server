
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;

/**
 * @type {HT~service}
 * @func productCategory_delete
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = productCategory_delete = async (req,res,next)=>{ 
   
   let {db} = dependencies;

   console.log(req.params.productCategory);
   
   try {

      let ress = await db.collection('productCategories').deleteMany({
         $or: [
            {_id: ObjectId(req.params.productCategory)},
            {parent: req.params.productCategory}
         ]
      });

      console.log(ress);
   
      res.json({
         ok: 1,
         message: {
            type: 'SUCCESS',
            text: 'Category Deleted'
         }
      })

   } catch (error) {
      console.log(error);
     
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Deleting Category. Contact Admin.'
         }
      })
   }
}

module.exports.api = {
   path : 'productcategories/:productCategory',
   method: 'delete',
   resource: 'ProductCategory',
   op: 'delete',
   description: 'Delete Product Category',
}

