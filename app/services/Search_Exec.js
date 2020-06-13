

const { dependencies } = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func Search_Exec
 * @memberof Services
 * @desc Searches for a resource
 */
module.exports = async (req,res,next)=>{ 
   const { db } = dependencies;
   console.log(req.query);

   if(!req.query.resource){
      res.status(404).json({
         error: {
            type: 'NOT_FOUND',
            text: 'Resource not found'
         }
      })
      return;
   }

   let { key } = req.query;

   if(!key || key.length === 0){
      res.status(404).json({
         error: {
            type: 'NOT_FOUND',
            text: 'Resource not found'
         }
      })
      return;
   }

   //build filter object
   let dbFilter = {};

   console.log(typeof(req.query.key));

   if(typeof(key) === 'string'){
      
      dbFilter[key] = req.query[key]
      
   }else{
      dbFilter = {};
      for(let k of key){
         dbFilter[k] = req.query[k];
      }
   }


   try {
   
      let collection;
      switch(req.query.resource.toLowerCase()){
         case 'product' : {
            collection = db.collection('products');
         }
      }
      let result = await collection.find(dbFilter).toArray();

      if(result.length === 0){
         res.status(404).json({
            error: {
               type: 'NOT_FOUND',
               text: 'Resource not found'
            }
         });
         return;
      }

      res.json({ 
         ok:1, 
         resource: result, 
         resourceType: 'Array',
         resourceItemType: req.query.resource
      });

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
   path : 'search',
   method: 'get',
   resource: 'Mixin',
   op: 'query',
   description: 'Find Resource',
}