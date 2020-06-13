

const { dependencies } = require(`${APP_ROOT}/dependencyManager`);


/**
 * @type {HT~service}
 * @func useraccount_list
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = useraccount_list = async (req,res,next)=>{ 
   const { db } = dependencies;
   
   try {
      const userAccounts = require(`${APP_ROOT}/mongodb_op_docs/aggregate/userAccounts`);

      let aggregationCursor = await db.collection('employees').aggregate(userAccounts());

      let resource = await aggregationCursor.toArray();

      res.json({
         ok: 1,
         resource,
         resourceType: 'Array',
         resourceArrayItemType: 'UserAccount'
      })
      
   } catch (error) {
      console.log(error);
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Error executing the useraccount.list service. Contact Administrator!'
         }
      })
   }

}


module.exports.api = {
   path : 'useraccounts',
   method: 'get',
   resource: 'UserAccount',
   op: 'list',
   description: 'List All User Accounts',
}