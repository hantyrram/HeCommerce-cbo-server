
const {dependencies} = require(`${global.APP_ROOT}/dependencyManager`);

const EMP_ID_PREFIX = "100";//company 1,company 2 = 200
// const GENESIS = 1000;//should not be assigned to anyone
const GENESIS = "_genesis_";
const START = 1001;//first employee
/**
 * @type {HT~service}
 * @func employee_add_eid_manual
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   let employeeId;
   //get the last employeeId skip on GENESIS
   let cursor = await db.collection('employees').find({employeeId: {$ne: GENESIS}}).sort({ employeeId:-1 }).limit(1);
   console.log(cursor.hasNext())
   if(! (await cursor.hasNext())){
    employeeId = `${EMP_ID_PREFIX}${START}`; //First employee
   }else{
    let lastDoc =  await cursor.next();
    let lastID = Number(lastDoc.employeeId.replace(EMP_ID_PREFIX,""));
    employeeId = `${EMP_ID_PREFIX }${lastID + 1}`;
   }
   
   try {
  
  
    let findAndModifyWriteOpResultObject = await db.collection('employees').findOneAndUpdate(
       {
         employeeId: employeeId
       },
       {
         $currentDate: {
            "_metadata.createdOn": {$type: "timestamp"} 
         },
      
         $setOnInsert: {
            ...req.body,
         }
       },
       {
          upsert: true,
          returnOriginal: false // return upserted
       }

    );
    
    let { value, ok, lastErrorObject } = findAndModifyWriteOpResultObject;

    console.log(value);
     
     res.status(201).json({
        ok:1,
        resource: value,
        links: {
           view: `/team/employees/${value._id}/view`,           
        }
     });
   } catch (error) {
    console.log(error);
    next(error);
   }
}

module.exports.api = {
   path : 'employees',
   method: 'post',
   resource: 'Employee',
   op: 'create',
   use: ['schemaValidator'],
   desciption: 'Create a new employee profile. Generating employee id automatically.',
   schemaValidator: {
      schema: 'Employee',
      op: 'create'
   }
}