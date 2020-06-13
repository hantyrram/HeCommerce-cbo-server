
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
 * @type {HT~service}
 * @func employee_add_eid_manual
 * @memberof Services
 * @desc Fetch image as stream, 
 */

module.exports = async (req,res,next)=>{ 
      let { product_id, _id } = req.params;
      let { db } = dependencies;
      let bucket = new GridFSBucket(db, {bucketName: 'products-images'}); 
      
      //!!!check if product_id is a valid product _id here,
      let cursor = await bucket.find({ _id: ObjectId(_id) },{limit: 1}); 
      if(await cursor.hasNext()){
         let image = await cursor.next();
         await bucket.openDownloadStream(image._id).pipe(res);
         return;
      }

      res.json({error: {type: 'NOT_FOUND',text: 'Image Not Found'}});
   }

module.exports.api = {
   path : 'products/:product_id/images/:_id',
   method: 'get',
   resource: 'Product.Image',
   op: 'read',
   description: 'Fetches A Single Product Image'
}

