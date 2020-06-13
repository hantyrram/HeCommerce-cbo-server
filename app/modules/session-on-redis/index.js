

const uuidv4 = require('uuid/v4');//connect session
// const uuidv5 = require('uuid/v5');//for uses sessionnpm
const session = require('./session');
const Cookie = require('./Cookie');
const redis = require('redis');
const DEFAULT_SESSION_EXPIRY = 60*60; // 1 HOUR



/**
 * @module session-on-redis
 * @param {Object} [redisClient] - The redis client to use. This module creates client by default if none is passed
 * @param {Object} [cookie] - The cookie.
 * @param {Object} [store] - The redis store,uses the local redis store by default.
 */
module.exports = ({redisClient,cookie,store})=>{
  let Session;
  if(!redisClient){
   Session = session(redis.createClient());
  }else{
   Session = session(redisClient);
  }
  
  let options = {
   cookie: {
    name : 'U_SID',
    expires: null,
    path : '/',
    sameSite: null,
    httpOnly: false,
    secure: false,
    domain: null
   },
   store: {
    // if there is a cookie and the cookie has expires value use it as redis store session expiry
    expires: cookie && cookie.expires? cookie.expires: DEFAULT_SESSION_EXPIRY
   }
  }

  if(cookie){
   Object.assign(options.cookie,cookie);
  }

  if(store){
   Object.assign(options.store,store);
  }

  return async function(req,res,next){
    //check if there is no session cookie
    if(!req.cookies[options.cookie.name]){
      let session = new Session();
      let cookie = new Cookie(options.cookie);
      //h_sid = encypretdSessionidAsCookieValue
      try {
        await session.setCookie(res,cookie);
        session.expire = options.store.expire;
        session.save();
        req.session = session;
      } catch (error) {
        console.log('@session-on-redis/index:62 ', {sor:error});
        next(error);
      }
      next();
      return;
    }
    //with U_SID cookie 
    try {
      //find the session from the store
      let sessionFound = await Session.find(req.cookies[options.cookie.name]);
      if(sessionFound){
        req.session = sessionFound;
        req.session.refresh();
      }else{
        req.session = new Session();
        let cookie = new Cookie(options.cookie);
        await req.session.setCookie(res,cookie);
        req.session.expire = options.store.expire;
        req.session.save();
      }
    } catch (error) {
      console.log('@session-on-redis/index:83 ',{sor:error});
      next(error);
    }
    next();
  };
}


