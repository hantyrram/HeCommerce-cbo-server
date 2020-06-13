const {dependencies} = require(DEPENDENCY_MANAGER_PATH);

module.exports = product_list = async (req,res,next)=>{
   let {db} = dependencies;
   try {
      // let products = await db.collection('products').find({}).toArray();  
      let cursor = await db.collection('products').aggregate([
         {
            $addFields:{
               "product_id": {
                  $convert: {
                     input: "$_id",
                     to: "string"
                  }
               }
            }
         },
         //metadata.owner = product._id string
         { 
            $lookup: {
               from: "products-images.files",
               localField: "product_id",
               foreignField: "metadata.owner",
               as: "images"
            }
         },
         { //remove product_id field
            $project:{
               "product_id": 0
            }
         }
      ]); 
      
      let products = await cursor.toArray();
      console.log(products);
      res.json({ 
         ok:1, 
         resource: products,
         resourceType: 'Array',
         resourceItemType: 'Product'
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
   path : 'products',
   method: 'get',
   resource: 'Product',
   op: 'list',
   description: 'Retrieve Products',
   // use: ['schemaValidator'],
   // schemaValidator: {
   //    schema: 'ProductCategory',
   //    op: 'create'
   // }
}