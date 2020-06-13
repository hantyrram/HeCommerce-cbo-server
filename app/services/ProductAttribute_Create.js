
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

/**
 * @type {HT~service}
 * @func attribute_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   try {

      

      await db.collection('attributes').createIndex({"name" : 1},{unique: 1});

      

      let insertOneWriteOpResultObject = await db.collection('attributes').insertOne(req.body);

      let {
         result,
         ops,
         insertedId,
      } = insertOneWriteOpResultObject;

      res.json({
         ok: result.ok,
         resource: ops[0],
         resourceType: 'Attribute',
         message: {
            type: 'SUCCESS',
            text: ops[0].name + ' Attribute Added.'
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
   path : 'productattributes',
   method: 'post',
   resource: 'ProductAttribute',
   op: 'create',
   serviceProvider: 'app/services/catalog/attribute/create',
   desciption: 'Create a new Product Attribute',
   // use: ['schemaValidator'],
   // schemaValidator: {
   //    schema: 'Employee',
   //    op: 'create'
   // }
}