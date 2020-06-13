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
      let resource  = await db.collection('storesettings.shipping.shippingzones').find({}).toArray();
      res.json({ok:1, resource , resourceType: 'List', resourceItemType: 'StoreSetting.Shipping.ShippingZone'});
   } catch (error) {
      res.json({
         error: {
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE_LIST_ERROR',
            text: 'Error Retrieving Shipping Zones.'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingzones',
   method: 'get',
   resource: 'StoreSetting.Shipping.ShippingZone',
   op: 'add',
   description: 'Fetch Shipping Zones'
}