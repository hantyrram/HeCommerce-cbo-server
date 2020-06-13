const MongoClient = require('mongodb').MongoClient;
const redis = require('redis');
global.DEPENDENCY_MANAGER_PATH = __filename;

/**
 * Using Reducer to set dependencies. Each depedency MUST call dispatch with {type:TYPES.<prop>,payload:any}.
 * Each dependency MUST have a corresponding key on the DEPENDENCY object.
 * 
 * The dependencies object is populated asynchronously.
 */
const DEPENDENCY = {
   DB: 'db',
   REDIS_CLIENT: 'redisClient'
}

const TYPES = {
   SET_DB: `SET-${DEPENDENCY.DB}`,
   SET_REDIS_CLIENT: `SET-${DEPENDENCY.REDIS_CLIENT}`
}

const useReducer = (reducer,initialState)=>{
   var state = initialState;

   let dispatch = (action)=>{
   Object.assign(state,reducer(state,action));
 }

 return [state,dispatch];

}

var [dependencies,dispatch] = useReducer((state,action)=>{
   switch(action.type){
      case TYPES.SET_DB:{
         return { [DEPENDENCY.DB]: action.payload, ...state};}
      case TYPES.SET_REDIS_CLIENT:{
         return { [DEPENDENCY.REDIS_CLIENT]: action.payload, ...state};} 
      default: return {...state};   
   }
},{});
 
/**
 * Async calls, prepare depedencies here,
 * Conditionals so that we can turn off dependencies, by commenting DEPENDENCY['KEY']
 */

/**
 * Initialize DB
 */
if(DEPENDENCY.DB){
   (async function(){
      try {
       let client = new MongoClient(process.env.MONGODB_URI,{useNewUrlParser:true});
     
       client.on('serverClosed',()=>{
        console.log('Close Triggered');
        dispatch({type: TYPES.SET_DB,payload:null});
       });
     
       //listen to server events heres...
     
       await client.connect();
       console.log(`@dependencyManager: Logging MONGODB_DBNAME`,process.env.MONGODB_DBNAME);
       dispatch({type: TYPES.SET_DB,payload: client.db(process.env.MONGODB_DBNAME)});
      } catch (error) {
       //??? NOTE: client won't reconnect on MongoNetworkError first attempt(intended behavious as per Mongodb driver doc)
       // Server must be restarted manually.
     
       console.log('Logging MongodbError',error);
      }
     })();
}

if(DEPENDENCY.REDIS_CLIENT){
   (async function(){
      try {
       const OPTIONS = {
           // host: "127.0.0.1",
           // port: 6379,
           url: process.env.REDIS_URL
       }
       let redisClient = redis.createClient(OPTIONS);
     
       redisClient.on('ready',function(p){
        dispatch({type: TYPES.SET_REDIS_CLIENT,payload: redisClient});
       });
     
       //a MUST to catch the error,node would crash if redis-server is not started.
       //this catches the error. Try catch block won't catch ECONNREFUSED error
       redisClient.on('error',function(e){
        if(e.code === 'ECONNREFUSED'){
         //send email
         console.log('Make Sure Redis Server is running!');
        }
        console.log(e);
        console.log('Error connecting to redis');
       });
     
       redisClient.on('reconnecting',function(o){
        console.log('Logging inside reconnecting',o);
       });
     
      } catch (error) {
         console.log(error);
      }
     })();
}


/**
 * @function
 * @description True if all the dependencies with keys defined on the DEPENDENCY object are set.
 */
const isReady = ()=>{
 //enumerate on DEPENDENCY values which are the property names of dependencies object.
 //check if all of the "dependencies" properties are set(with truthy values).
 //redis must be connected
 return Object.values(DEPENDENCY).every( key=> {
   if(key === 'REDIS_CLIENT'){
      // If redis client is one of the dependencies,make sure it's connected
      console.log('@dependencyManager: Checking if redis is connected: status = ', Boolean(dependencies[key]) && dependencies[key].connected);
      return Boolean(dependencies[key]) && dependencies[key].connected; 
   }
   return Boolean(dependencies[key]);
 }) 
//  && (dependencies[DEPENDENCY.REDIS_CLIENT] ? dependencies[DEPENDENCY.REDIS_CLIENT].connected : false);
 //Redis must not only exist but also connected
 //put this somewhere else, e.g. DEPEDENCY.ADDITIONAL CHECK FOR [DEPENDENCY.<NAME>]
 
};



/**
 * @type {Object}
 * @description - The object containing the dependencies.
 */
module.exports.dependencies = dependencies;
module.exports.isReady = isReady;
