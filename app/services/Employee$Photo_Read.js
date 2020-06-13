
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
 * @desc Creates a new Employee Profile
 */
// module.exports = employee_photo_add = async (req,res,next)=>{ 

   
//    let upload = multer();

//    req.app.use(upload.single('employee-avatar'));

//    let { db } = dependencies;
//    let bucket = new GridFSBucket(db,'employee_photo_bucket');
//    req.on('data',function(data){
//       console.log(data);
//    })
  
//    res.json({ok:1})
// }

module.exports = async (req,res,next)=>{ 
      let { _id } = req.params;
      let { db } = dependencies;
      // res.set('Content-Type','image/png');
      let bucket = new GridFSBucket(db, {bucketName: 'employees-photo'}); //??? put bucketName on employee module settings file
      let stream  = new PassThrough();
      let defaultAvatarRS = await fs.createReadStream(path.join(SERVER_ROOT,'assets/images/AvatarBlue.png'));
      let cursor = await bucket.find({ _id: _id  }); //id does not require ObjectId wrapper
      if(await cursor.hasNext()){
         console.log('@Employee$Photo_Read:44 Has Next =',await cursor.hasNext());
         await bucket.openDownloadStream( _id ).pipe(res);
         return ;

      }
      defaultAvatarRS.pipe(res); //default avatar

   }

module.exports.api = {
   path : 'employees/:_id/photo',
   method: 'get',
   resource: 'Employee$Photo',
   op: 'read',
   description: 'Fetch Employee\'s Photo'
}

