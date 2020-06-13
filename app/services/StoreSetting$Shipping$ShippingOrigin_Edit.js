//name
//country
//city
//zip
//email
//contact person

const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;

module.exports = async (req,res,next)=>{
   const SETTING_NAME = 'StoreSetting.Shipping.ShippingOrigin'
   let { db } = dependencies;

   console.log('body',req.body);
   try {
      let { value, ok, lastErrorObject } = await db.collection('store_settings').findOneAndUpdate(
         { name: SETTING_NAME },
         {
            $set : {
               value: req.body
            }
         },
         {
            upsert: true,
            returnOriginal:false
         }
      );

      console.log('value',value);
      res.json({
         ok:1, resource: value,
         message: {
            type: 'SUCCESS',
            text: 'Shipping origin update.'
         }
      });
   } catch (error) {
      res.json({
         error: {
            type: 'STORESETTING.SHIPPING.SHIPPINGORIGIN_EDIT_ERROR',
            text: 'Error updating shipping origin'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingorigin',
   method: 'patch',
   resource: 'StoreSetting.Shipping.ShippingOrigin',
   op: 'edit',
   description: 'Update shipping origin setting.'
   // use: ['schemaValidator'],
   // schemaValidator: {//schemaValidator options
   //    schema: 'Employee',
   //    op: 'edit',
   // }
}