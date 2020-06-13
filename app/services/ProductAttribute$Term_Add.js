
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const ObjectId = require('mongodb').ObjectId;

/**
 * @type {HT~service}
 * @func attribute_addTerm
 * @memberof Services
 * @desc Adds a Term to an existing attribute.
 */
module.exports = attribute_addTerm = async (req,res,next)=>{ 
   
   let {db} = dependencies;

   console.log(ObjectId.isValid(req.params.id));

   let _id = ObjectId(req.params.id);
   console.log(_id)
   try {

      let {
         matchedCount,
         ops
      } = await db.collection('attributes').updateOne(
         {  _id   },
         {
            $addToSet : {
               "terms" : req.body.term.toLowerCase()
            } 
         }
      );

      console.log(ops)

      if(matchedCount === 0){
         res.status(404).json({
            error: {
               type: 'ERROR',
               text: 'Attribute not found!'
            }
         })
         return;
      }

      res.status(200).json({
         ok:1,
         resource: req.body.term,
         resourceType: 'Attribute$Term',
         message: {
            type: 'MESSAGE',
            text: `${req.body.term} term added.`
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
   path : 'productattributes/:id/terms/add',
   method: 'patch',
   resource: 'Attribute$Terms',
   op: 'edit',
   serviceProvider: 'app/services/catalog/attribute/addTerm',
   desciption: 'Add new Term to the Attribute',
   // use: ['schemaValidator'],
   // schemaValidator: {
   //    schema: 'Employee',
   //    op: 'create'
   // }
}