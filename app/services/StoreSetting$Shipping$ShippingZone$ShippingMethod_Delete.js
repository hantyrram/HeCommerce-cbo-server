
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
   
   console.log(req.params);

   try {

      let { value,ok,lastErrorObject } = 
         await db.collection('storesettings.shipping.shippingzones').findOneAndUpdate(
            { _id: ObjectId(shippingZoneId) },
            {
               $pull: {
                  "shippingMethods": {
                     "_name": req.params.shippingMethodName
                  }
               }
            },{
               returnOriginal:false
            }
         );
         
         console.log(value);

         res.json({ok:1, resource: value, resourceType: 'StoreSetting.Shipping.ShippingZone.ShippingMethod'});

   } catch (error) {
      console.log(error);
      
      res.status(500).json({
         error: {
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE.SHIPPINGMETHOD_DELETE_ERROR',
            text: 'Error Deleting Shipping Method from the Shipping Zone'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingzones/:shippingZoneId/shippingMethods/:shippingMethodName',
   method: 'delete',
   resource: 'StoreSetting.Shipping.ShippingZone.ShippingMethod',
   op: 'delete',
   description: 'Remove Shipping Method To Shipping Zone'
}