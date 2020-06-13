/**
 * Converts apis to permissions objects.
 * input = [
   {resource:'employee',op:'remove'}
   {resource:'employee',op:'read'}
   {resource:'employee',op:'create'}
   {resource:'employee.credential',op:'write'}
   ]

   output = [
   {employee:{write:0,read:0,create:0}},
   {employee.credential:{write:0}}
   ]
 * 
 * @param {Array} apis - Apis 
 */
function getPermissions(apis){
   return apis.reduce(function(acc,element,index){
      let p = {};
      if(acc.length === 0){
         p[element.resource] = {[element.op]: 0};
         acc.push(p);
         return acc;
      }
      let i = acc.findIndex(function(permission){
      //check for existing permission object based on resource
      return Object.getOwnPropertyNames(permission).indexOf(element.resource) !== -1;
      });
       
      if(i === -1){
         //add new permission
         p[element.resource] = {[element.op]: 0};
         acc.push(p);
         return acc;
      }
      //just add/embed op to existing permission object;
      Object.assign(p,acc[i]);
      Object.assign(p[element.resource],{[element.op]:0});
      acc.splice(i,1,p);
       
      return acc;
      },[]);
      
}

module.exports = getPermissions;