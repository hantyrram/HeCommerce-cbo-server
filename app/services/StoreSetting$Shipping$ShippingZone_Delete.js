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

      let resource  = await db.collection('storesettings.shipping.shippingzones').deleteOne({_id: ObjectId(req.params._id)});
      res.json({ok:1, resource: {_id : req.params._id}});

   } catch (error) {
      res.json({
         error: {
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE_DELETE_ERROR',
            text: 'Error Retrieving Shipping Zones.'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingzones/:_id',
   method: 'delete',
   resource: 'StoreSetting.Shipping.ShippingZone',
   op: 'delete',
   description: 'Fetch Shipping Zones'
}