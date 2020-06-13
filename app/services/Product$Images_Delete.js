
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

const GridFSBucket = require('mongodb').GridFSBucket;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const {PassThrough} = require('stream');
const multer = require('multer');
const upload = multer();
/**
 * @type {HT~service}
 * @memberof Services
 * @desc Adds a product image. 
 */


module.exports = async (req,res,next)=>{ 
   let { product_id, _id } = req.params; // image id
   let { db } = dependencies;

   try {

      let bucket = new GridFSBucket(db,{bucketName: 'products-images'});
      
      bucket.delete(ObjectId(_id), (error,result)=>{
         console.log(`Product.Images_Delete result`,result);
         if(!error){
            
            res.json({ok: 1});
            return;
         }
         console.log(`Product.Images_Delete error`,error);
         res.json({
            error: {
               type: 'SERVER_ERROR',
               text: 'Error Deleting Image. Contact Admin.'
            }
         })
      });

   } catch (error) {
      console.log(error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Deleting Image. Contact Admin.'
         }
      })
   }
}

module.exports.api = {
   path : 'products/:product_id/images/:_id',
   method: 'delete',
   resource: 'Product.Images',
   op: 'delete',
   description: 'Deletes a single image'
}


