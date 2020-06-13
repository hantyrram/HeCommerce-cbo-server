
const {dependencies} = require(`${global.APP_ROOT}/dependencyManager`);

const EMP_ID_PREFIX = "100";//company 1,company 2 = 200
const GENESIS = 1000;//should not be assigned to anyone
const START = 1001;//first employee
/**
 * @type {HT~service}
 * @func employee_add_eid_manual
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = employee_add = async (req,res,next)=>{ 
   
   let {db} = dependencies;
   
   let employeeId;
   //get last
   let cursor = await db.collection('employees').find({}).sort({ employeeId:-1 }).limit(1);
   if(! (await cursor.hasNext())){
    employeeId = `${EMP_ID_PREFIX}${START}`; //First employee
   }else{
    let lastDoc =  await cursor.next();
    let lastID = Number(lastDoc.employeeId.replace(EMP_ID_PREFIX,""));
    employeeId = `${EMP_ID_PREFIX }${lastID + 1}`;
   }
   
   try {
  
    let QUERY = { employeeId: employeeId };
  
    let UPDATE = {
  
     $currentDate: {
        "_metadata.createdOn": {$type: "timestamp"} 
     },
  
     $setOnInsert: {
        ...req.body,
     }
    }
  
    let OPTIONS = {
     upsert: true
    }
  
    let result = await db.collection('employees').updateOne(QUERY,UPDATE,OPTIONS);
    let { matchedCount } = result;
    if(matchedCount > 0){ // username is already on db
     res.json(
        { 
              error: {
                 type: 'DUPLICATE_KEY_VIOLATION',
                 text: 'Employee ID is already issued!'
           } 
        } 
     )
     return;
    }
  
     let data = {
        resource: {
           _id: result.upsertedId._id, 
        }
     };
    
     console.log('Base URL',req.app);
     let artifact = {
        ok: 1,
        href: req.hostname + '/apiv1/employees/' + data.resource._id,
        code: 201
  
     };
     res.json({
        ok:1,
        resource
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