/**
 * Hydrates the Employee.UserAccount.Roles from Roles.
 * 
 * @param {ObjectId} _id - The _id of the Employee. Instance of ObjectId
 * 
 * Sample Result = [ { roles : [...] } ]
 */
module.exports = (_id)=>{
   return [
        {
         $match: {
            _id
         }
      },
      //perform a join op
      {
         "$lookup": {
            from: "roles",
            localField: "userAccount.roles.role_id",
            foreignField: "_id",
            as: "userAccount.roles"
         }
      },
      {
         $project: {
            employeeId:1,
            "userAccount.roles": 1
         }
      },
      {
         $replaceWith: {
            $mergeObjects: [{roles:null},"$userAccount"],
         }
      }
   ]
}