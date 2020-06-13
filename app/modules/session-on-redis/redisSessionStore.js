const redis = require('redis');
const client = redis.createClient();

client.monitor((err,result)=>{
  console.log('Redis Monitor Mode!');
});

client.on('monitor',(time,args,raw_reply)=>{
  console.log(time,' : ',args);
});

/**
 * Save the sessionID together with the session data. Session data are saved as hash field value.
 * 
 * @param {string} sessionID - The sessionID to set
 * @param {object} session - The session object
 */
const set = (sessionID,session) => {
  client.hset(sessionID,'data',JSON.stringify(session),redis.print);
}

/**
 * 
 * @param {string} sessionID - The sessionID to find
 * @param {function} errorResultCallback - error first callback,session found on the store is passed as second parameter
 */
const get = (sessionID,errorResultCallback) => {
  client.exists(sessionID,(error,reply) => {
    if(error) {console.log('store@get',error); errorResultCallback(error);return;}
    if(reply === 1){//sessionID exists
      client.hget(sessionID,'data',(result)=>{
        if(result){
          console.log(result);
          errorResultCallback(null,JSON.parse(result));
        }
      });
    }
  });
}

const getSession = (sessionID)=>{
  return new Promise((resolve,reject)=>{
    client.exists(sessionID,(error,reply) => {
      if(error) {reject({redisError:error})}//redis error
      if(reply === 1){//sessionID exists
        client.hget(sessionID,"data",(hgetError,result)=>{
          if(result){
            console.log('Result=',result);
            resolve(result);
          }else{
            reject({redisError:hgetError});
          }
        });
      }
    });
  });
}

const exists = (sessionID)=>{
  return new Promise((resolve,reject)=>{
    client.exists(sessionID,(error,reply) => {
      if(error) {reject({redisError:error})}//redis error
      if(reply === 1){//sessionID exists
        client.hget(sessionID,"data",(hgetError,result)=>{
          if(result){
            console.log('Result=',result);
            resolve(result);
          }else{
            reject({redisError:hgetError});
          }
        });
      }
    });
  });
}


/**
 * Deletes the sessionID from storage
 * @param {string} sessionID 
 */
const destroy = (sessionID) => {
  client.DEL(sessionID);
}

//allow access to the client 
// module.exports.redisClient = client;
// module.exports.set = set;
// module.exports.get = get;
// module.exports.getSession = getSession;
// module.exports.destroy = destroy;


Object.defineProperty(module.exports,'redisClient',{writable:false,value:client});
Object.defineProperty(module.exports,'set',{writable:false,value:set});
Object.defineProperty(module.exports,'get',{writable:false,value:get});
Object.defineProperty(module.exports,'getSession',{writable:false,value:getSession});
Object.defineProperty(module.exports,'destroy',{writable:false,value:destroy});
