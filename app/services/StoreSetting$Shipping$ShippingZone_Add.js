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
   

   try {

      let { ops } = 
         await db.collection('storesettings.shipping.shippingzones').insertOne(req.body);
         res.json({ok:1, resource: ops[0] , resourceType: 'StoreSetting.Shipping.ShippingZone'});
   } catch (error) {
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
            type: 'STORESETTING.SHIPPING.SHIPPINGZONE_ADD_ERROR',
            text: 'Error Adding Shipping Zone'
         }
      })
   }
  
}


module.exports.api = {
   path : 'storesettings/shipping/shippingzones',
   method: 'post',
   resource: 'STORESETTING$SHIPPING$SHIPPINGZONE',
   op: 'add',
   description: 'Add Shipping Zone',
   use: ['schemaValidator'],
   schemaValidator: {//schemaValidator options
      schema: 'ShippingZone',
      op: 'add',
   }
}