const {dependencies} = require(DEPENDENCY_MANAGER_PATH);

module.exports = productcategory_list = async (req,res,next)=>{
   let {db} = dependencies;
   try {
      let productCategories = await db.collection('productCategories').find({}).toArray();  
      res.json({ 
         ok:1, 
         resource: productCategories,
         resourceType: 'Array',
         resourceItemType: 'ProductCategory'
      });

   } catch (error) {
      console.log(error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Fetching Categories. Contact Administrator.'
         }
      })
   }
}

module.exports.api = {
   path : 'productcategories',
   method: 'get',
   resource: 'ProductCategory',
   op: 'list',
   description: 'Retrieves Product Category List',
}