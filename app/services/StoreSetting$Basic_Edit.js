//name
//country
//city
//zip
//email
//contact person

const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;


module.exports = employee_edit = async (req,res,next)=>{
   const SETTING_NAME = 'StoreSetting.Basic'
   let { db } = dependencies;
   console.log(req.body);
   try {
      let { value, ok, lastErrorObject } = await db.collection('store_settings').findOneAndUpdate(
         { name: SETTING_NAME },
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

      res.json({ok:1, resource: value});
   } catch (error) {
      res.json({
         error: {
            type: 'STORESETTING$BASIC_EDIT_ERROR',
            text: 'Error Updating Store Basic Setting.'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/:settingname',
   method: 'patch',
   resource: 'STORESETTING$BASIC',
   op: 'edit',
   description: 'Update Store\s Basic Setting'
   // use: ['schemaValidator'],
   // schemaValidator: {//schemaValidator options
   //    schema: 'Employee',
   //    op: 'edit',
   // }
}