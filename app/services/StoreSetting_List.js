

const { dependencies } = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func useraccount_list
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = async (req,res,next)=>{ 
   const { db } = dependencies;
   
   try {
      let resource = await db.collection('store_settings').find({}).toArray();
      console.log(resource);
      
      res.json({
         ok: 1,
         resource,
         resourceType: 'Array',
         resourceArrayItemType: 'StoreSetting'
      })
      
   } catch (error) {
      console.log(error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error executing the useraccount.list service. Contact Administrator!'
         }
      })
   }

}


module.exports.api = {
   path : 'storesettings',
   method: 'get',
   resource: 'StoreSetting',
   op: 'list',
   description: 'Fetches all store settings',
}