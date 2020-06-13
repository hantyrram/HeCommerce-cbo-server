//name
//country
//city
//zip
//email
//contact person

const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;

module.exports = async (req,res,next)=>{
   let { db } = dependencies;

   try {
      await db.collection('storesettings.shipping.shippingzones').createIndex({zoneName: 1},{unique: true});   
   } catch (error) {
      console.log(error);
      res.status(500).json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error executing StoreSetting.Shipping.ShippingZone_Add service.'
         }
      })  
      return;
   }
   
   //deconstruct separate _id from rest
   const { _id, ...shippingZone } = req.body;

   console.log(shippingZone);
   try {

      let { value, ok, lastErrorObject } = await db.collection('storesettings.shipping.shippingzones').findOneAndUpdate(
         { _id: ObjectId(req.params._id)},
         {
            $set : {
              ...shippingZone
            }
         },
         {
            upsert: true,
            returnOriginal:false
         }
      );
         res.json({ 
            ok:1, 
            resource: value, 
            resourceType: 'StoreSetting.Shipping.ShippingZone', 
            message: {
               type: 'SUCCESS',
               text: `${value.zoneName} updated.`
            }
          });

   } catch (error) {
      console.log(error);
      if(error && error.code === 11000){
         let duplicateKey = Object.keys(error.keyValue)[0];
         let duplicateValue = error.keyValue[duplicateKey];
         
         res.status(409).json({
            error: {
               type: 'DUPLICATE_KEY_ERROR',
               text: `${duplicateKey} ${duplicateValue} already exist`
            }
         })
         return;
      }
      res.status(500).json({
         error: {
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE_EDIT_ERROR',
            text: 'Error Updating Shipping Zone'
         }
      })
   }
  
}

//put , complete doc only,
module.exports.api = {
   path : 'storesettings/shipping/shippingzones/:_id',
   method: 'put',
   resource: 'STORESETTING$SHIPPING$SHIPPINGZONE',
   op: 'edit',
   description: 'Update Shipping Zone',
   use: ['schemaValidator'],
   schemaValidator: {//schemaValidator options
      schema: 'ShippingZone',
      op: 'edit',
   }
}