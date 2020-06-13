/**
 * Retreive All User Accounts, with UserAccount.Roles hydrated from Roles collection, using
 * left outer join ($lookup)
 * 
 */
module.exports = ()=>{
   return [
      {
        $match: {
           userAccount: {
              "$exists": true
           }
        }
      },
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
            userAccount: 1
         }
      },
      {
         $replaceWith : {
            $mergeObjects: [{_owner: "$employeeId",credential:null,roles:[]},"$userAccount"]
         }
      }
   ]
}