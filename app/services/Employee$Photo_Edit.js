
const {dependencies} = require(`${APP_ROOT}/dependencyManager`);

const GridFSBucket = require('mongodb').GridFSBucket;
const ObjectId = require('mongodb').ObjectId;
const fs = require('fs');
const {PassThrough} = require('stream');
const multer = require('multer');
const upload = multer();
/**
 * @type {HT~service}
 * @func _id_photo_edit
 * @memberof Services
 * @desc Changes the photo of the _id.
 */

module.exports = [
  
   upload.single('employeeAvatar'),

  async (req,res,next)=>{ 
   let { _id } = req.params; // _id = _id
   let { db } = dependencies;

   let bucket = new GridFSBucket(db,{bucketName: 'employees-photo'});//??? put bucketName on _id module settings file

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

   //delete photo if it exist
   let deletePhotoPromise = new Promise(function(resolve,reject){
      (async function(){
         let cursor = await bucket.find({_id: _id }); //id does not require ObjectId wrapper

         if(await cursor.hasNext()){
            console.log('Has Photo');
            bucket.delete( _id, function(error){
               if(error){
                  console.log(error);
                  reject(error);
                  return;
               }
               resolve('photo-delete-ok');
            });
            return;
         }

         resolve('photo-delete-ok'); //resolve if _id does not yet exist, this op will add photo
      })()
   });

   try {

      let e = await deletePhotoPromise;
      console.log(e);
      let fileExtension = req.file.originalname.substring(index);

      let fileName = `${_id}-avatar${fileExtension}`; ///??? * put on settings
      
      // use PassThrough to engulp file buffer and pipe to bucket upload stream
      let readableStream = new PassThrough();

      readableStream.end(req.file.buffer); 

      readableStream
         .pipe(bucket.openUploadStreamWithId(_id,fileName))
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
               //set _id.photo field
               (async function(){
                  let photo = null;
                  let cursor = await bucket.find({_id: _id});
                  if(await cursor.hasNext()){
                     photo = await cursor.next();
                     await db.collection('_ids').updateOne(
                        {_id: ObjectId(_id)},
                        {
                           $set : {
                              photo: photo
                           }
                        }
                     )
                  }

                  res.json({
                     ok:1,
                     message: {
                        type: 'SUCCESS',
                        text: 'Employee Photo Was Changed.'
                     },
                     resource: photo,
                     type: 'Photo'
                  });

               })(); 
            
            });

   } catch (error) {
      console.log('Delete Photo Error : ', error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error Changing Photo, Please try again later.'
         }
      })
   }

   

   
      
   }
]

module.exports.api = {
   path : 'employees/:_id/photo',
   method: 'post',
   resource: 'Employee$Photo',
   op: 'edit',
   description: 'Edit Employee\'s Photo'
}


