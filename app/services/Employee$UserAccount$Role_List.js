/**
 * Creates an employee credential.
 */

const ObjectId = require('mongodb').ObjectId;

/**
 * Adds role to employee's user account.
 */
module.exports = employee_roles_list = async(req,res,next)=>{

   let {db} = hantyr.dependencyManager.dependencies;
   
   let employee = req.preLoadedResource['Employee'];
  
   // let {userAccount} = await db.collection('employees').findOne(
   //    {
   //       _id: ObjectId(employee._id)
   //    },
   //    {
   //       projection: {
   //          "userAccount.roles": 1
   //       }
   //    }  
   // );

   // console.log(userAccount.roles.map(role=> 
   //    {
   //    return ObjectId(role.role_id)
   //    }
   // ));

   //aggregate returns a cursor

   let employee_roles = await db.collection('employees').aggregate([
      {
         $match: {
            _id: ObjectId(employee._id)
         }
      },
      //perform a join op
      {
         "$lookup": {
            from: "roles",
            localField: "userAccount.roles.role_id",
            foreignField: "_id",
            as: "roles"
         }
      },
      {
         "$project": {
            roles: 1
         }
      },
       {
         "$project": {
            "roles.permissions": 0
         }
      }
   ]).toArray();

   console.log(employee_roles);
   
   res.json({
      ok: 1,
      resource: {
         name: req.currentApi.resource,
         value: employee_roles[0].roles
      },
      // resource: (userAccount || {}).roles,
      resourceType: 'Array',
      resourceArrayItemType: 'Role'
   });

}

module.exports = {
   path : 'employees/:employee/useraccount/roles',
   method: 'get',
   resource: 'Employee$UserAccount$Role',
   op: 'list',
   description: 'Fetch Employee\'s User Account Roles.',
}

