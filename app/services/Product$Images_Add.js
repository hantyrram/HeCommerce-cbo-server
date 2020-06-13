
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

const GridFSBucket = require('mongodb').GridFSBucket;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const {PassThrough} = require('stream');
const multer = require('multer');
const upload = multer();
/**
 * @type {HT~service}
 * @func employee_photo_edit
 * @memberof Services
 * @desc Adds a product image. 
 */


module.exports = [
  
   upload.single('productImage'), //req.file = productImage
   
  async (req,res,next)=>{ 
   let { _id: product_id } = req.params; // employee = _id
   let { db } = dependencies;
   let bucket = new GridFSBucket(db,{bucketName: 'products-images'});//??? put bucketName on employee module settings file

   if(!req.file){
      res.json({
         error: {
            type: 'INVALID_FILE_TYPE',
            text: 'Image is not in acceptable format!'
         }
      });
      return;
   }
   
   //filter
   let index = (req.file.originalname.toLowerCase().search(/.jpg|.jpeg|.png$/));

   if(index === -1){
      res.json({
         error: {
            type: 'INVALID_FILE_TYPE',
            text: 'Image is not in acceptable format!'
         }
      });
      return;
   }

   
   let fileExtension = req.file.originalname.substring(index);

   let fileName = `${product_id}_${Date.now()}${fileExtension}`; ///??? * put on settings
   
   // use PassThrough to engulp file buffer and pipe to bucket upload stream
   let readableStream = new PassThrough();

   readableStream.end(req.file.buffer); 

   readableStream
      .pipe(bucket.openUploadStream(fileName, { metadata: { owner: product_id, ownerType: 'Product' } }))
         .on('error',function(error){
            console.log('Error Saving Photo',error);
            if(error){
               res.json({
                  error: {
                     type: 'WRITE_FILE_ERROR',
                     text: 'There was an error saving the image. Contact Administrator.'
                  }
               })
               return;
            }
            
            
         })
         .on('finish',function(){
            //add to product.images set
            (async function(){
               //query the last added by upload date in desc order,
               //??? this could result in a race condition on the front end, when multiple users
               //are adding images on the same product
               let cursor = await bucket.find({"metadata.owner": product_id}).sort({uploadDate: -1}).limit(1);
               let images = await cursor.toArray();
               res.json({
                  ok:1,
                  message: {
                     type: 'SUCCESS',
                     text: 'Product Image Added'
                  },
                  resource: images[0],
                  resourceType: 'Product.Image'
               });
               //return whole product to make it simpler
            })(); 
         
         });
   }
]

module.exports.api = {
   path : 'products/:_id/images',
   method: 'post',
   resource: 'Product.Images',
   op: 'add',
   description: 'Add A Product Image'
}


