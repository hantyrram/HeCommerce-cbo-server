
const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;

/**
 * Note returns the modified shipping zone instead of just the shipping methods of the shipping zone
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = async (req,res,next)=>{
   let { db } = dependencies;

   const { shippingZoneId } = req.params;


   try {

      let { value,ok,lastErrorObject } = 
         await db.collection('storesettings.shipping.shippingzones').findOneAndUpdate(
            { _id: ObjectId(shippingZoneId) },
            {
               $addToSet: {
                  shippingMethods: req.body
               }
            },{
               returnOriginal:false
            }
         );
         
         console.log(value);

         res.json({ok:1, resource: value, resourceType: 'StoreSetting.Shipping.ShippingZone'});

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
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE.SHIPPINGMETHOD_ADD_ERROR',
            text: 'Error adding Shipping Method to the Shipping Zone'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingzones/:shippingZoneId/shippingMethods',
   method: 'patch',
   resource: 'StoreSetting.Shipping.ShippingZone.ShippingMethod',
   op: 'add',
   description: 'Add Shipping Method To Shipping Zone',
   use: ['schemaValidator'],
   schemaValidator: {//schemaValidator options
      schema: 'ShippingMethod',
      op: 'add',
   }
}