



/**
 * @type {HT~service}
 * @func role_create
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
module.exports = async (req,res,next)=>{ 
   
   // let apis = req.app.get('apis');

   // let modifiedApis = apis.map(api=>{
   //    api.serviceProvider = api.serviceProvider.replace(/\//g,'.');
   //    return api;
   // });
   // console.log(modifiedApis);
   res.json({ok: 1, resource: [], resourceType:'Array', resourceArrayItemType: 'Api'});
}

module.exports.api = {
   path : 'apis',
   method: 'get',
   resource: 'Api',
   op: 'list'
}



