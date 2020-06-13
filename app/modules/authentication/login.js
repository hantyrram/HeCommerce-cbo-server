

const ObjectID = require('mongodb').ObjectID;
/**
 * @type {typedefs~service}
 * @desc logs in a user.
 */
module.exports = login = async(req,res)=>{
 console.log('Login reached');
   try {     
    let { username, password } = req.body;
    let QUERY = { username:req.body.username, password:req.body.password };
    let OPTIONS = { 
     projection: {
      password: 0
     } 
    };
    const MATCH_EMPLOYEES_WITH_CREDENTIALS = { $match: { credential: { $exists:true } } };
    const MATCH_CREDENTIAL = { $match: { 
     "credential.username": username,
     "credential.password": password, 
     // "credential.temp":{$ne:true} //NOT temp
    } };
    const PROJECT_CREDENTIALS_ONLY = { $project:  {credential: 1 } };
    const PROJECT_EXCLUDE_PASSWORD = { $project: { "credential.password":0 } };
    let aggregationCursor = await req.app.get('db').collection('employees').aggregate(
    [
     MATCH_EMPLOYEES_WITH_CREDENTIALS,
     MATCH_CREDENTIAL,//MUST
     PROJECT_CREDENTIALS_ONLY,
     PROJECT_EXCLUDE_PASSWORD
    ] 
    );

    // let user = await req.app.get('db').collection('users').findOne(QUERY,OPTIONS);
    let foundEmployee = await aggregationCursor.next();
    if(foundEmployee){
      // Borrows Employee._id as Authentication's Users user._id
      // let user = { _id: foundEmployee._id ,username: foundEmployee.credential.username };
      let user = { _id: foundEmployee._id, credential: {username: foundEmployee.credential.username}};
      req.login(null,user);
    }else{
      req.login('Invalid Username or Password',null);
    }
   } catch (error) {
     console.log({loginServiceError:error});
   }
}

module.exports.permissionIsRequired = false;