
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: IMAGES_PRODUCTS_DIR});
const ObjectId = require('mongodb').ObjectId;

/**
 * @type {HT~service}
 * @func employee_photo_edit
 * @memberof Services
 * @desc Adds a product image. 
 */


module.exports = [
  
   upload.single('productImage'), //req.file = productImage
   
  async (req,res,next)=>{ 

      let { db } = dependencies;
      const PRODUCT_ID = req.params._id;
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
    
      const image_id = new ObjectId();

      const  { mimetype, originalname, filename, size, encoding, fieldname } = req.file;

      const findAndModifyWriteOpResultObject = await db.collection('products').findOneAndUpdate(
         { _id: ObjectId(req.params._id) },
         {
            $addToSet : {
               images: {
                  _id: image_id,
                  filename,
                  mimetype,
                  originalname,
                  size,
                  encoding,
                  ext: fileExtension,
                  product_id: ObjectId(req.params._id)                  
               }
            }
         },
         {
            returnOriginal: false
         }
      )
      let oldPath = req.file.path;
      let newPath = req.file.path.replace(req.file.filename,req.params._id + '_' + image_id + fileExtension);

      fs.renameSync(
         oldPath,
         newPath
      );

      
      res.json({ok:1,
         resource: product.images,
         resourceType: 'Product.Images',
         message: {
            type: 'SUCCESS',
            text: 'Product image added'
         }
      })
      
      
      
   
   }
]

module.exports.api = {
   path : 'products/:_id/images',
   method: 'post',
   resource: 'Product.Images',
   op: 'add',
   description: 'Add A Product Image'
}


