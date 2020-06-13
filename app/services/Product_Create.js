
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

/**
 * @type {HT~service}
 * @func product_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = product_create = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {

      await db.collection('products').createIndex({"name" : 1},{unique: 1});

      if(!req.body.type){
         req.body.type = 'standard';
      }

      if(!req.body.type){
         req.body.inStock = false;
      }

      let insertOneWriteOpResultObject = await db.collection('products').insertOne(req.body);

      let {
         result,
         ops,
         insertedId,
      } = insertOneWriteOpResultObject;

      res.json({
         ok: result.ok,
         resource: ops[0],
         resourceType: 'Product',
         message: {
            type: 'SUCCESS',
            text: ops[0].name + ' Product Added.'
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
            text: 'Error Creating Product. Contact Admin.'
         }
      })
   }
}


module.exports.api = {
   path : 'products',
   method: 'post',
   resource: 'Product',
   op: 'create',
   description: 'Create New Product',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Product',
      op: 'create'
   }
}