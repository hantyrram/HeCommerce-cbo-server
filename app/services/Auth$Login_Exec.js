const { dependencies } = require('../dependencyManager');

module.exports = async (req,res,next)=>{
   console.log('Login reached');
   const { db } = dependencies;
   try {     
    let { username, password } = req.body;
    const MATCH_EMPLOYEES_WITH_CREDENTIALS = { $match: { "userAccount.credential": { $exists:true } } };
    const MATCH_CREDENTIAL = { $match: { "userAccount.credential.username" : username, "userAccount.credential.password":password} }
   //  const PROJECT_CREDENTIALS_ONLY = { $project:  {"userAccount.credential": 1 } };
    const PROJECT_EXCLUDE_PASSWORD = { $project: { "userAccount.credential.password":0 } };
    let aggregationCursor = await db.collection('employees').aggregate(
      [
         MATCH_EMPLOYEES_WITH_CREDENTIALS,
         MATCH_CREDENTIAL,//MUST
         // PROJECT_CREDENTIALS_ONLY,
         PROJECT_EXCLUDE_PASSWORD
      ] 
    );

    // let user = await req.app.get('db').collection('users').findOne(QUERY,OPTIONS);
    let foundEmployee = await aggregationCursor.next();
    console.log('@Auth$Login:23 Found Employee',foundEmployee);
    if(foundEmployee){
      // Borrows Employee._id as Authentication's Users user._id
      // let user = { _id: foundEmployee._id ,username: foundEmployee.credential.username };
      let user = { _id: foundEmployee._id, credential: {username: foundEmployee.userAccount.credential.username, photo: foundEmployee.photo}};
      
      req.login(null,user);
    }else{
      const error = {
         type: 'AUTH_ERROR',
         text: 'Invalid User'
      }
      req.login(error,null);
    }
   } catch (error) {
      res.json({
         nok: 1,
         error: {
            type: 'SERVER_ERROR',
            text: 'Auth.Login Service Error'
         }
      })
   }
     

}

module.exports.api = {
   path : 'auth/login',
   method: 'post',
   resource: 'Auth$Login',
   op: 'exec',
   use: ['schemaValidator'],
   schemaValidator: {
      schema: 'Credential',
      op: 'exec'
   }
}