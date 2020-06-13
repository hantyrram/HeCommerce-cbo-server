
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

/**
 * @type {HT~service}
 * @func productCategory_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = productCategory_create = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {

      await db.collection('productCategories').createIndex({"name" : 1, "parent":1},{unique: 1});

      let insertOneWriteOpResultObject = await db.collection('productCategories').insertOne(req.body);

      let {
         result,
         ops,
         insertedId,
      } = insertOneWriteOpResultObject;

      res.json({
         ok: result.ok,
         resource: ops[0],
         resourceType: 'ProductCategory',
         message: {
            type: 'SUCCESS',
            text: ops[0].name + ' Category Added.'
         }
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
            text: 'Error Creating Category. Contact Admin.'
         }
      })
   }
}

module.exports.api = {
   path : 'productcategories',
   method: 'post',
   resource: 'ProductCategory',
   op: 'create',
   description: 'Create New Product Category',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'ProductCategory',
      op: 'create'
   }
}

