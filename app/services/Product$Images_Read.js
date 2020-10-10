
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);
const GridFSBucket = require('mongodb').GridFSBucket;
const GridStore = require('mongodb').GridStore;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const {PassThrough} = require('stream');
const multer = require('multer');
const upload = multer();
const path = require('path');

/**
 * Returns a single product image
 */

module.exports = async (req,res,next)=>{ 

      let { product_id, _id } = req.params;

      //check image
      const product = await dependencies.db.collection('products').findOne(
         {
            _id: ObjectId(product_id)
         },
         {
            projection: {
               images: 1
            }
         }
      )

      let image = (product.images || []).find( image => image._id == _id);

      if(!image){
         return res.status(400).json({
            error: {
               type: 'NOT_FOUND',
               text: 'Image not found'
            }
         })
      }

      const DIR = STATICDB_DIR + `/images/products/${product_id + '_' + _id + image.ext}`;
      
      image['href'] = `${IMAGES_PRODUCTS_PATH}/${product_id + '_' + _id + image.ext}`;
      // let rs = await fs.createReadStream(DIR);

      res.json({
         ok: 1,
         resource: image,
         resourceType: 'Product.Images.Image'
      })
      

   }

module.exports.api = {
   path : 'products/:product_id/images/:_id',
   method: 'get',
   resource: 'Product.Image',
   op: 'read',
   description: 'Fetches A Single Product Image'
}

