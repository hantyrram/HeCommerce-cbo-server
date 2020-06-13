



/**
 * @type {HT~service}
 * @func getCountries
 * @memberof Services
 * @desc Philippine Standard Geographic Code
 */
const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;
const http = require('http');
const https = require('https');
const PSGC_URL = 'http://localhost:8085/';

module.exports = async (req,res,next)=>{ 

   let i = req.url.indexOf('?');
   let queryString = '';
   let param = '';
   let path = '';
   if(i !== -1){
      queryString = req.url.substr(i + 1);
   }

   if(req.params && req.params.param){
      param = req.params.param; //maps to psgc path
      path = `${param}`;
   }
   
   path += queryString && queryString.length > 0 ? `?${queryString}` : '';
   try{

      let url = PSGC_URL;
      
      if(param && param.length >0){
         url += param; //e.g. /regions, /municipalities
      }

      if(queryString && queryString.length > 0){
         url += `?${queryString}`;
      }

      
      let data = await new Promise((resolve,reject)=>{
         http.get(url, response => {
            let str = '';
            response.on('data',(d)=>{
               str += d.toString();
            });
            response.on('end',()=>{
               if(response.statusCode === 200){
                  resolve(JSON.parse(str));
                  return;
               }
               reject();
               
            })
         });
      });


      res.json(data);

      // res.json({});
   } catch (error) {
      console.log(error);  
      res.json({
         error: {
            type: 'SERVER_ERROR',
            text: 'Util.ExtData.PSGC_Read Service Error.'
         }
      })
   }
   
   
   
}


module.exports.api = {
   path : 'util/extdata/psgc/:param?', //param can be /provinces, maps to psgc routes
   method: 'get',
   resource: 'Util$ExtData$PSGC',   
   op: 'read',
   description: 'PSGC ',
}