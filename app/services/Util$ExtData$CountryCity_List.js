



/**
 * @type {HT~service}
 * @func getCountries
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;
const http = require('http');
const https = require('https');

module.exports = async (req,res,next)=>{ 

   if(!req.params.country){
      res.json({});
      return;
   }

   let country = req.params.country === 'United States' ? 'United States': req.params.country;

   let states = [];
   
   try {
      
      let {db} = dependencies;

      let helpers_data = await db.collection('helpers_data').find({}).toArray();
      
      states = helpers_data && helpers_data[0] ?helpers_data[0].states : null;

      if(!states || !states[country.toUpperCase()]){ // data not yet on local db, fetch
         
         let getaccesstokenOptions = {
            headers: {
               Accept: "application/json",
               "api-token": process.env.UNIVERSAL_TUTORIAL_REST_API_TOKEN,
               "user-email": "rongrammer@hotmail.com"
            }
         }

         let auth_token = await new Promise((resolve,rej)=>{
            https.get("https://www.universal-tutorial.com/api/getaccesstoken",getaccesstokenOptions, getResponse=>{
               let auth_token_json_string = ""; //is json string
   
               getResponse.on('data', d =>{
                  console.log(d.toString());
                  auth_token_json_string = auth_token_json_string.concat(d.toString());
               });
   
               getResponse.on('end',()=>{
                  // res.json({ok:1,data:  JSON.parse(auth_token)})
                  let at = JSON.parse(auth_token_json_string);
                  resolve(at.auth_token);
               });
            });
         });

         let requestOptions = {
            headers: {
               "Authorization": `Bearer ${auth_token}`,
               "Accept": "application/json"
            }
         }

         //states promise try catch block - start
         try { // states promise try catch block
            states = await new Promise((resolve,rej)=>{
                  https.get(`https://www.universal-tutorial.com/api/cities/${country}`,requestOptions,(getResponse)=>{
                  let statesJson = ""; //is json string
      
                  getResponse.on('data', d =>{
                     
                     statesJson = statesJson.concat(d.toString());
                  });
                  getResponse.on('end',()=>{
                     console.log(statesJson);
                     if(getResponse.statusCode !== 200){
                        reject({statusCode: getResponse.statusCode});
                        return;
                     }
                     
                     resolve(JSON.parse(statesJson));
                  });
               });
            });   
         } catch (error) { //reject state promise
            res.json({
               [country] : [] //just return empty array
            })
            return;
         }
         //states promise try catch block - end

         if(states.length !== 0){ //only cache on db, country with states. 
            await db.collection('helpers_data').updateOne({},{
               $set: {
                  [`states.${country.toUpperCase()}`]: states
               }
            },{
               upsert: true
            })
         }
      }

      // {"United States": [] }
      res.json( { [country] : states[country.toUpperCase()]} ); //country name as key

   } catch (error) {
      console.log(error);  
   }
   
   
   
}


module.exports.api = {
   path : 'util/extdata/cities/:country?',
   method: 'get',
   resource: 'CountryStates',   
   op: 'list',
   description: 'Fetch country states list.',
}