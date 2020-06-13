//name
//country
//city
//zip
//email
//contact person

const {dependencies} = require(APP_ROOT + '/dependencyManager');

module.exports = async (req,res,next)=>{
   
   let { db } = dependencies;
   
   try {
      let { value, ok, lastErrorObject } = await db.collection('setting.store.general').findOneAndUpdate(
         { },
         {
            $set : {
               value: hantyr.function.flatten(req.body)
            }
         },
         {
            upsert: true,
            returnOriginal:false
         }
      );

      res.json({ ok:1, resource: value, message: { type: 'SUCCESS', text: 'Setting updated.'} });

   } catch (error) {
      res.json({
         error: {
            type: 'SETTING$STORE$GENERAL_EDIT_ERROR',
            text: 'Error Updating Store Basic Setting.'
         }
      })
   }
  
}


module.exports.api = {
   path : 'setting/store/general',
   method: 'patch',
   resource: 'Setting.Store.General',
   op: 'edit',
   description: 'Update Store\s General Setting'
   // use: ['schemaValidator'],
   // schemaValidator: {//schemaValidator options
   //    schema: 'Employee',
   //    op: 'edit',
   // }
}