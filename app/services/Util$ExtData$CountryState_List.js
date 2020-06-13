



/**
 * @type {HT~service}
 * @func getCountries
 * @memberof Services
 * @desc Creates a new Employee Profile
 */
const {dependencies} = require(APP_ROOT + '/dependencyManager');
const ObjectId = require('mongodb').ObjectId;
const https = require('https');

module.exports =  async (req,res,next)=>{ 

   /**
    * Constants used for adjustments with countries from RESTCOUNTRIES api that have long country names.
    * Those country names does not work with universal-tutorial api.
    */
   const UNITED_STATES = 'United States';
   const UNITED_KINGDOM = 'United Kingdom';
   const VENEZUELA = 'Venezuela';
   const TANZANIA = 'Tanzania';
   const KOREA = 'Korea';
   const MACEDONIA = 'Macedonia';


   if(!req.params.country){
      res.json({});
      return;
   }

   let country = req.params.country.includes('United States')  ? 'United States': req.params.country;
   
   if(country.includes(UNITED_STATES)){
      country = UNITED_STATES;
   }

   if(country.includes(UNITED_KINGDOM)){
      country = UNITED_KINGDOM;
   }

   if(country.includes(VENEZUELA)){
      country = VENEZUELA;
   }

   if(country.includes(TANZANIA)){
      country = TANZANIA;
   }

   if(country.includes(KOREA)){
      country = KOREA;
   }

   if(country.includes(MACEDONIA)){
      country = MACEDONIA;
   }




   

   let states = [];
   
   try {
      
      let {db} = dependencies;

      let helpers_data = await db.collection('helpers_data').find({}).toArray();
      
      states = helpers_data && helpers_data[0] ?helpers_data[0].states : null;

      if(!states || !states[country.toUpperCase()]){
         
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
                  https.get(`https://www.universal-tutorial.com/api/states/${country}`,requestOptions,(getResponse)=>{
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
   path : 'util/extdata/states/:country?',
   method: 'get',
   resource: 'CountryState',   
   op: 'list',
   description: 'Fetch country states list.',
}